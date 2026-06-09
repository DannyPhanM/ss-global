// recently-viewed.js
// Handles storing and retrieving recently viewed product IDs in a cookie

const RECENTLY_VIEWED_KEY = 'recently_viewed_products';
const RECENTLY_VIEWED_MAX = 4;

function getRecentlyViewedProducts() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith(RECENTLY_VIEWED_KEY + '='));
  if (!cookie) return [];
  try {
    return JSON.parse(decodeURIComponent(cookie.split('=')[1])) || [];
  } catch {
    return [];
  }
}

function setRecentlyViewedProducts(handles) {
  document.cookie = `${RECENTLY_VIEWED_KEY}=${encodeURIComponent(JSON.stringify(handles.slice(0, RECENTLY_VIEWED_MAX)))}; path=/; max-age=${60*60*24*30}`;
}

function addRecentlyViewedProduct(productHandle) {
  let handles = getRecentlyViewedProducts();
  handles = handles.filter(h => h !== productHandle);
  handles.unshift(productHandle);
  setRecentlyViewedProducts(handles);
}

function clearRecentlyViewedProducts() {
  document.cookie = `${RECENTLY_VIEWED_KEY}=; path=/; max-age=0`;
  const lists = document.querySelectorAll('#predictive-search-recently-viewed-list');
  
  if (lists.length) {
    lists.forEach(list => list.innerHTML = '');
  }
  
  if (window.updateRecentlyViewedEmptyText) {
    window.updateRecentlyViewedEmptyText();
  }
}

// Usage: Call addRecentlyViewedProduct(productHandle) on product page view
window.addRecentlyViewedProduct = addRecentlyViewedProduct;
window.getRecentlyViewedProducts = getRecentlyViewedProducts;
window.clearRecentlyViewedProducts = clearRecentlyViewedProducts;

// Debug: Log recently viewed product handles on every page load

// console.log('[RecentlyViewed] Product handles in cookie:', getRecentlyViewedProducts());

// Hiển thị hoặc ẩn thông báo trống trong header search
document.addEventListener('DOMContentLoaded', function() {
  function updateRecentlyViewedEmptyText() {
    const lists = document.querySelectorAll('#predictive-search-recently-viewed-list');
    lists.forEach(list => {
      const hasItems = list.children.length > 0;
      const container = list.closest('.predictive_search_open') || list.closest('.predictive-search') || list.closest('.search-modal__content');
      if (!container) return;

      const emptyText = container.querySelector('#predictive-search-recently-viewed-empty');
      if (emptyText) {
        emptyText.style.display = hasItems ? 'none' : 'flex';
      }

      const group = container.querySelector('#predictive-search-recently-viewed-group');
      if (group) {
        if (hasItems) {
            group.style.display = '';
        }
      }
      
      const clearButtons = container.querySelectorAll('.predictive-search__clear-button');
      clearButtons.forEach(btn => {
        btn.style.display = hasItems ? 'inline-block' : 'none';
      });
    });
  }
  window.updateRecentlyViewedEmptyText = updateRecentlyViewedEmptyText;

  // Initial call to hide/show empty text
  updateRecentlyViewedEmptyText();

  // If predictive_search is disabled, manually render recently viewed
  if (!window.customElements.get('predictive-search')) {
    const lists = document.querySelectorAll('#predictive-search-recently-viewed-list');
    const handles = window.getRecentlyViewedProducts ? window.getRecentlyViewedProducts() : [];
    
    if (lists.length && handles.length) {
      Promise.all(handles.map(handle => fetch(`/products/${handle}.js`).then(r => r.json()).catch(() => null)))
        .then(products => {
          products = products.filter(Boolean);
          if (!products.length) return;

          lists.forEach(list => {
            list.innerHTML = '';
            products.forEach((product, idx) => {
              const li = document.createElement('li');
              li.className = 'predictive-search__list-item';
              li.setAttribute('role', 'option');
              li.setAttribute('aria-selected', 'false');
              li.id = `predictive-search-option-recently-${idx+1}`;
              
              let imgHtml = '';
              if (product.featured_media && product.featured_media.preview_image) {
                imgHtml = `<img class="predictive-search__image" src="${product.featured_media.preview_image.src}&width=300" alt="${product.featured_media.alt || product.title}" width="155" height="72">`;
              } else if (product.featured_image) {
                imgHtml = `<img class="predictive-search__image" src="${product.featured_image}&width=300" alt="${product.title}" width="155" height="72">`;
              }
              
              let priceHtml = '';
              if (product.price) {
                priceHtml = `<div class="predictive-search__item-price">${(product.price/100).toLocaleString('vi-VN', {style:'currency',currency:'VND'})}</div>`;
              }
              
              li.innerHTML = `
                <a href="${product.url || '/products/' + product.handle}" class="predictive-search__item predictive-search__item--link-with-thumbnail link link--text" tabindex="-1">
                  ${imgHtml}
                  <div class="predictive-search__item-content">
                    <p class="predictive-search__item-heading h5" style="font-family: var(--font-card-title-family);">${product.title}</p>
                    ${priceHtml}
                  </div>
                </a>
              `;
              list.appendChild(li);
            });
          });
          updateRecentlyViewedEmptyText();
        });
    }
  }
});
