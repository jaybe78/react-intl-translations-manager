'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _mkdirp = require('mkdirp');

var _stringify = require('./stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _writeReportFile = require('./writeReportFile');

var _writeReportFile2 = _interopRequireDefault(_writeReportFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkModifiedKeys = function checkModifiedKeys(messages, path) {
  var fs = require('fs');
  var changes = [];
  //check whether properties have changed
  return new Promise(function (resolve) {
    // Do async job
    if (fs.existsSync(path)) {
      //console.log(path);
      // check whether existing  keys have changed
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) throw err;
        var oldMessage = JSON.parse(data);
        changes = Object.keys(oldMessage).reduce(function (acc, current) {
          if (messages[current] !== oldMessage[current]) {
            acc.push({
              id: current,
              oldMessage: oldMessage[current],
              newMessage: messages[current]
            });
          }
          return acc;
        }, []);
        resolve(changes);
      });
    } else {
      resolve(changes);
    }
  });
};

exports.default = function (_ref) {
  var messages = _ref.messages,
      directory = _ref.directory,
      _ref$fileName = _ref.fileName,
      fileName = _ref$fileName === undefined ? 'defaultMessages.json' : _ref$fileName,
      _ref$sortKeys = _ref.sortKeys,
      sortKeys = _ref$sortKeys === undefined ? true : _ref$sortKeys,
      _ref$jsonSpaceIndenta = _ref.jsonSpaceIndentation,
      jsonSpaceIndentation = _ref$jsonSpaceIndenta === undefined ? 2 : _ref$jsonSpaceIndenta;

  return new Promise(function (resolve) {
    if (!messages) {
      throw new Error('Messages are required');
    }

    if (!directory || typeof directory !== 'string' || directory.length === 0) {
      throw new Error('Directory is required');
    }
    var DIR = _path2.default.join(directory, fileName);
    checkModifiedKeys(messages, DIR).then(function (changes) {
      //console.log('after checkModifiedKeys');
      (0, _mkdirp.sync)(directory);
      (0, _fs.writeFileSync)(DIR, (0, _stringify2.default)(messages, { space: jsonSpaceIndentation, sortKeys: sortKeys }));
      resolve(changes);
    });
  });
};