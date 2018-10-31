'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by i315756 on 10/31/18.
 */
var fs = require('fs');

exports.default = function (obj, directory) {
  var REPORT_DIR = _path2.default.join(directory, 'report.json');

  var json = JSON.stringify(obj, null, '\t');

  (0, _fs.writeFileSync)(REPORT_DIR, json);
};