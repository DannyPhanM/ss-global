function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

window.SwymBeforeRender = window.SwymBeforeRender || [];

window.SwymBeforeRender.push(function (UIObj) {
  UIObj.Registry.preloadComponent('productPrice', function (OriginalComp) {
    var FormatProductPriceComponent = /*#__PURE__*/function (_OriginalComp) {
      _inherits(FormatProductPriceComponent, _OriginalComp);
      var _super = _createSuper(FormatProductPriceComponent);

      function FormatProductPriceComponent() {
        _classCallCheck(this, FormatProductPriceComponent);
        return _super.apply(this, arguments);
      }

      _createClass(FormatProductPriceComponent, [{
        key: "render",
        value: function render() {
          var ctx = this.context.UI;
          var pr = this.props.listItem.pr;
          var originalPrice = this.props.productItem.op;

          ctx.FormatPrice = function (value) {
            var currency = window._swat.currency || "₫";
            var locale = "en-US";
            var formatted = Math.round(value).toLocaleString(locale);
            
            // Format suffix correctly for VND/đ
            if (currency === "₫" || currency === "đ" || currency.toLowerCase() === "vnd") {
              return formatted + " VND";
            }
            return currency + formatted;
          };

          return UIObj.Renderer.createElement("div", {
            "class": "swym-product-price swym-has-sale l"
          }, UIObj.Renderer.createElement("div", {
            "class": "swym-product-final-price swym-value"
          }, ctx.FormatPrice(pr)), UIObj.Renderer.createElement("div", {
            "class": "swym-product-original-price swym-value"
          }, originalPrice ? ctx.FormatPrice(originalPrice) : ""));
        }
      }]);

      return FormatProductPriceComponent;
    }(OriginalComp);

    UIObj.Registry.register("WishlistContainer.Detail.Grid.Item.Price", FormatProductPriceComponent);
  });
});
