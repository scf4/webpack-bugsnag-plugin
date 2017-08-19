'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSafeRepositoryUrl = exports.getOriginRemoteUrl = exports.getLatestCommitHash = exports.getCurrentBranch = undefined;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exec(cmd, options) {
  return new Promise(function (resolve, reject) {
    _child_process2.default.exec(cmd, { cwd: options.path }, function (err, stdout, stderr) {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function getCurrentBranch(options) {
  return exec('git symbolic-ref HEAD | sed \'s!refs/heads/!!\'', options); // TODO Remove `sed` for Windows support
}

function getLatestCommitHash(options) {
  return exec('git log -n 1 --pretty=format:"%H"', options);
}

function getOriginRemoteUrl(options) {
  return exec('git remote get-url origin', options).then(getSafeRepositoryUrl);
}

function getSafeRepositoryUrl(repositoryUrl) {
  var parsed = _url2.default.parse(repositoryUrl);
  parsed.auth = null;
  return _url2.default.format(parsed);
}

exports.getCurrentBranch = getCurrentBranch;
exports.getLatestCommitHash = getLatestCommitHash;
exports.getOriginRemoteUrl = getOriginRemoteUrl;
exports.getSafeRepositoryUrl = getSafeRepositoryUrl;