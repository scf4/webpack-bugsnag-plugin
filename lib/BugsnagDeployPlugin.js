'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _CommonBugsnagPlugin2 = require('./helpers/CommonBugsnagPlugin');

var _CommonBugsnagPlugin3 = _interopRequireDefault(_CommonBugsnagPlugin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var USER_AGENT = 'WebpackBugsnagDeployPlugin/' + require('../package.json').version;
var BUGSNAG_DEPLOY_URL = 'https://notify.bugsnag.com/deploy';

var BugsnagDeployPlugin = function (_CommonBugsnagPlugin) {
  _inherits(BugsnagDeployPlugin, _CommonBugsnagPlugin);

  function BugsnagDeployPlugin(_ref) {
    var _ref$apiKey = _ref.apiKey,
        apiKey = _ref$apiKey === undefined ? null : _ref$apiKey,
        _ref$releaseStage = _ref.releaseStage,
        releaseStage = _ref$releaseStage === undefined ? 'production' : _ref$releaseStage,
        _ref$repository = _ref.repository,
        repository = _ref$repository === undefined ? null : _ref$repository,
        _ref$provider = _ref.provider,
        provider = _ref$provider === undefined ? null : _ref$provider,
        _ref$branch = _ref.branch,
        branch = _ref$branch === undefined ? null : _ref$branch,
        _ref$revision = _ref.revision,
        revision = _ref$revision === undefined ? null : _ref$revision,
        _ref$appVersion = _ref.appVersion,
        appVersion = _ref$appVersion === undefined ? null : _ref$appVersion;

    _classCallCheck(this, BugsnagDeployPlugin);

    var _this = _possibleConstructorReturn(this, (BugsnagDeployPlugin.__proto__ || Object.getPrototypeOf(BugsnagDeployPlugin)).call(this));

    _this.options = {
      apiKey: apiKey,
      releaseStage: releaseStage,
      repository: repository,
      provider: provider,
      branch: branch,
      revision: revision,
      appVersion: appVersion
    };
    _this.validateOptions();
    return _this;
  }

  _createClass(BugsnagDeployPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      compiler.plugin('after-emit', this.handle.bind(this));
    }
  }, {
    key: 'getPopulatedProperties',
    value: function getPopulatedProperties(obj) {
      var value = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] != null) {
          value[key] = obj[key];
        }
      }
      return value;
    }
  }, {
    key: 'mapProjectDetailsToDeployOptions',
    value: function mapProjectDetailsToDeployOptions(details) {
      return this.getPopulatedProperties({
        appVersion: details.version,
        branch: details.branch,
        repository: details.repository,
        revision: details.revision
      });
    }
  }, {
    key: 'getDeployOptions',
    value: function getDeployOptions(compilation) {
      var _this2 = this;

      return this.getProjectDetails(compilation).then(function (details) {
        return _extends({}, _this2.mapProjectDetailsToDeployOptions(details), _this2.getPopulatedProperties(_this2.options));
      } // Don't override with nulls
      );
    }
  }, {
    key: 'sendDeployRequest',
    value: function sendDeployRequest(options) {
      return (0, _requestPromiseNative2.default)({
        method: 'POST',
        uri: BUGSNAG_DEPLOY_URL,
        body: options,
        json: true,
        headers: {
          'user-agent': USER_AGENT
        }
      });
    }
  }, {
    key: 'handle',
    value: function handle(compilation, callback) {
      var _this3 = this;

      this.getDeployOptions(compilation).then(function (options) {
        return _this3.sendDeployRequest(options);
      }).catch(this.handleErrors(compilation, callback)).then(function () {
        return callback();
      });
    }
  }]);

  return BugsnagDeployPlugin;
}(_CommonBugsnagPlugin3.default);

exports.default = BugsnagDeployPlugin;