'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _git = require('./git');

var _package = require('./package');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommonBugsnagPlugin = function () {
  function CommonBugsnagPlugin() {
    _classCallCheck(this, CommonBugsnagPlugin);
  }

  _createClass(CommonBugsnagPlugin, [{
    key: 'validateOptions',

    /**
     * Ensures that the basic options required for all Bugsnag plugins are validated.
     * 
     * - apiKey (32 characters string)
     */
    value: function validateOptions() {
      var apiKey = this.options.apiKey;

      if (!apiKey) {
        throw new Error('You must provide your Bugsnag API key to the BugsnagPlugin.');
      }
    }

    /**
     * Returns a promise which returns attempts to grab information about the webpack project.
     *
     * This is done by tracking down a package.json file, and extracting information from
     * the git repository. If git is not installed, the appropriate project details should be
     * manually passed to the BugsnagPlugin.
     * 
     * @param {*} compilation
     * @returns {Promise<object>}
     */

  }, {
    key: 'getProjectDetails',
    value: function getProjectDetails(compilation) {
      var options = {
        path: compilation.compiler.options.context
      };
      return Promise.all([]).then(function (_ref) {
        var _ref2 = _toArray(_ref);

        return {
          version: 1
        };
      });
    }

    /**
     * Handles errors the "webpack" way, by adding them to the compilation.errors array.
     * 
     * @param {*} compilation
     * @returns {function}
     */

  }, {
    key: 'handleErrors',
    value: function handleErrors(compilation) {
      var pluginName = Object.getPrototypeOf(this).constructor.name;
      return function (err) {
        compilation.errors.push(new Error(pluginName + ' (' + err.message + ')'));
      };
    }
  }]);

  return CommonBugsnagPlugin;
}();

exports.default = CommonBugsnagPlugin;