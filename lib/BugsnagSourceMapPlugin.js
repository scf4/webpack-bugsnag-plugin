'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _CommonBugsnagPlugin2 = require('./helpers/CommonBugsnagPlugin');

var _CommonBugsnagPlugin3 = _interopRequireDefault(_CommonBugsnagPlugin2);

var _bugsnagSourcemaps = require('bugsnag-sourcemaps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BugsnagSourceMapPlugin = function (_CommonBugsnagPlugin) {
  _inherits(BugsnagSourceMapPlugin, _CommonBugsnagPlugin);

  function BugsnagSourceMapPlugin(_ref) {
    var _ref$apiKey = _ref.apiKey,
        apiKey = _ref$apiKey === undefined ? null : _ref$apiKey,
        _ref$publicPath = _ref.publicPath,
        publicPath = _ref$publicPath === undefined ? null : _ref$publicPath,
        _ref$appVersion = _ref.appVersion,
        appVersion = _ref$appVersion === undefined ? null : _ref$appVersion,
        _ref$overwrite = _ref.overwrite,
        overwrite = _ref$overwrite === undefined ? false : _ref$overwrite,
        _ref$endpoint = _ref.endpoint,
        endpoint = _ref$endpoint === undefined ? 'https://upload.bugsnag.com' : _ref$endpoint;

    _classCallCheck(this, BugsnagSourceMapPlugin);

    var _this = _possibleConstructorReturn(this, (BugsnagSourceMapPlugin.__proto__ || Object.getPrototypeOf(BugsnagSourceMapPlugin)).call(this));

    _this.options = {
      apiKey: apiKey,
      publicPath: publicPath,
      appVersion: appVersion,
      overwrite: overwrite,
      endpoint: endpoint
    };
    _this.validateOptions();
    return _this;
  }

  _createClass(BugsnagSourceMapPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      compiler.plugin('after-emit', this.handle.bind(this));
    }
  }, {
    key: 'getSourceMaps',
    value: function getSourceMaps(compilation) {
      var sourceMaps = [];

      var stats = compilation.getStats().toJson();
      var outputPath = _path2.default.resolve(compilation.compiler.options.context, compilation.compiler.options.output.path);
      var publicPath = this.options.publicPath || stats.publicPath;
      publicPath += /\/$/.test(publicPath) ? '' : '/';

      stats.chunks.forEach(function (chunk) {
        var _chunk$files$filter = chunk.files.filter(function (file) {
          return (/\.js$/.test(file)
          );
        }),
            _chunk$files$filter2 = _slicedToArray(_chunk$files$filter, 1),
            file = _chunk$files$filter2[0];

        var _chunk$files$filter3 = chunk.files.filter(function (file) {
          return (/\.js\.map$/.test(file)
          );
        }),
            _chunk$files$filter4 = _slicedToArray(_chunk$files$filter3, 1),
            sourceMap = _chunk$files$filter4[0];

        if (sourceMap) {
          sourceMaps.push({
            url: publicPath + file,
            file: _path2.default.resolve(outputPath, file),
            sourceMap: _path2.default.resolve(outputPath, sourceMap)
          });
        }
      });

      return sourceMaps;
    }
  }, {
    key: 'uploadSourceMaps',
    value: function uploadSourceMaps(options, sourceMaps) {
      return Promise.all(sourceMaps.map(function (_ref2) {
        var url = _ref2.url,
            file = _ref2.file,
            sourceMap = _ref2.sourceMap;
        return (0, _bugsnagSourcemaps.upload)(_extends({}, options, {
          minifiedUrl: url,
          minifiedFile: file,
          sourceMap: sourceMap
        }));
      }));
    }
  }, {
    key: 'getUploadOptions',
    value: function getUploadOptions(compilation) {
      var _options = this.options,
          apiKey = _options.apiKey,
          appVersion = _options.appVersion,
          overwrite = _options.overwrite,
          endpoint = _options.endpoint;

      var uploadOptions = { apiKey: apiKey, appVersion: appVersion, overwrite: overwrite, endpoint: endpoint };
      if (appVersion) {
        return Promise.resolve(uploadOptions);
      } else {
        return this.getProjectDetails(compilation).then(function (details) {
          uploadOptions.appVersion = details.version;
          return uploadOptions;
        });
      }
    }
  }, {
    key: 'handle',
    value: function handle(compilation, callback) {
      var _this2 = this;

      var sourceMaps = this.getSourceMaps(compilation);
      this.getUploadOptions(compilation).then(function (options) {
        return _this2.uploadSourceMaps(options, sourceMaps);
      }).catch(this.handleErrors(compilation, callback)).then(function () {
        return callback();
      });
    }
  }]);

  return BugsnagSourceMapPlugin;
}(_CommonBugsnagPlugin3.default);

exports.default = BugsnagSourceMapPlugin;