'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var t = (0, _reactIntl.defineMessages)({
  helloWorld: {
    'id': 'hello_world',
    'defaultMessage': 'Hello {name}'
  },
  name: {
    'id': 'hello_name',
    'defaultMessage': 'Your name'
  }
});

var HelloWorld = function (_Component) {
  _inherits(HelloWorld, _Component);

  function HelloWorld(props) {
    _classCallCheck(this, HelloWorld);

    var _this = _possibleConstructorReturn(this, (HelloWorld.__proto__ || Object.getPrototypeOf(HelloWorld)).call(this, props));

    _this.state = {
      name: ''
    };
    return _this;
  }

  _createClass(HelloWorld, [{
    key: 'onNameChange',
    value: function onNameChange(newName) {
      this.setState({ name: newName });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var formatMessage = this.context.intl.formatMessage;


      return _react2.default.createElement(
        'div',
        null,
        formatMessage(t.helloWorld, { name: this.state.name }),
        _react2.default.createElement('input', {
          type: 'text',
          onChange: function onChange(e) {
            return _this2.onNameChange(e.target.value);
          },
          placeholder: formatMessage(t.name)
        })
      );
    }
  }]);

  return HelloWorld;
}(_react.Component);

HelloWorld.contextTypes = { intl: _reactIntl.intlShape };

exports.default = HelloWorld;