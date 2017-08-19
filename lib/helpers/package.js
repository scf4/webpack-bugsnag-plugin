'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageRepository = exports.getPackageVersion = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _pkgUp = require('pkg-up');

var _pkgUp2 = _interopRequireDefault(_pkgUp);

var _git = require('./git');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REPOSITORY_STRING_REGEX = /((gist|bitbucket|gitlab):)?(\w+)\/(\w+)/;

function getPackage(_ref, callback) {
  var path = _ref.path;

  return (0, _pkgUp2.default)(path).then(function (packagePath) {
    var value = null;
    if (packagePath) {
      var pkg = require(packagePath);
      if ((value = callback(pkg)) == null) {
        // undefined/null
        value = null;
      }
    }
    return value;
  });
}

function getPackageVersion(options) {
  return getPackage(options, function (pkg) {
    if (pkg.version) {
      return pkg.version;
    }
  });
}

function stringifyRepository(type, owner, name) {
  switch (type) {
    case 'github':
      return 'https://github.com/' + owner + '/' + name + '.git';
    case 'gitlab':
      return 'https://gitlab.com/' + owner + '/' + name + '.git';
    case 'bitbucket':
      return 'https://bitbucket.org/' + owner + '/' + name + '.git';
    default:
      return null;
  }
}

function getPackageRepository(options) {
  return getPackage(options, function (pkg) {
    if (pkg.repository) {
      var repository = pkg.repository;

      switch (typeof repository === 'undefined' ? 'undefined' : _typeof(repository)) {
        case 'string':
          {
            if (repository.match(REPOSITORY_STRING_REGEX)) {
              var _repository$split = repository.split(REPOSITORY_STRING_REGEX),
                  _repository$split2 = _slicedToArray(_repository$split, 5),
                  _repository$split2$ = _repository$split2[2],
                  type = _repository$split2$ === undefined ? 'github' : _repository$split2$,
                  owner = _repository$split2[3],
                  name = _repository$split2[4];

              return stringifyRepository(type, owner, name);
            }
            break;
          }
        case 'object':
          {
            if (repository.type === 'git') {
              // The repository.url field should probably not contain auth info, but in case it does
              // we strip out any potential username/password within. #savinglives
              return (0, _git.getSafeRepositoryUrl)(repository.url);
            }
            break;
          }
        default:
          {
            // It must be in some other weird/non-standard format...
            break;
          }
      }
    }
  });
}

exports.getPackageVersion = getPackageVersion;
exports.getPackageRepository = getPackageRepository;