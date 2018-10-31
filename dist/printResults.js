'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printReportGroupedByLocal = undefined;

var _chalk = require('chalk');

var _printer = require('./printer');

var _compareByKey = require('./compareByKey');

var _compareByKey2 = _interopRequireDefault(_compareByKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var _ref$deleted = _ref.deleted,
      deleted = _ref$deleted === undefined ? [] : _ref$deleted,
      _ref$untranslated = _ref.untranslated,
      untranslated = _ref$untranslated === undefined ? [] : _ref$untranslated,
      _ref$added = _ref.added,
      added = _ref$added === undefined ? [] : _ref$added,
      _ref$updated = _ref.updated,
      updated = _ref$updated === undefined ? [] : _ref$updated,
      _ref$sortKeys = _ref.sortKeys,
      sortKeys = _ref$sortKeys === undefined ? true : _ref$sortKeys;

  if (!(deleted.length || added.length || updated.length || untranslated.length)) {
    console.log((0, _chalk.green)('  Perfectly maintained, no remarks!'));
    (0, _printer.newLine)();
  } else {
    if (!reportGroupedByLocales) {
      if (deleted.length) {
        var items = sortKeys ? deleted.sort(_compareByKey2.default) : deleted;
        (0, _printer.subheader)('Deleted keys:');
        items.forEach(function (_ref2) {
          var key = _ref2.key,
              message = _ref2.message;
          return console.log('  ' + (0, _chalk.red)(key) + ': ' + (0, _chalk.cyan)(message));
        });
        (0, _printer.newLine)();
      }

      if (untranslated.length) {
        var _items = sortKeys ? untranslated.sort(_compareByKey2.default) : untranslated;
        (0, _printer.subheader)('Untranslated keys:');
        _items.forEach(function (_ref3) {
          var key = _ref3.key,
              message = _ref3.message;
          return console.log('  ' + (0, _chalk.yellow)(key) + ': ' + (0, _chalk.cyan)(message));
        });
        (0, _printer.newLine)();
      }

      if (added.length) {
        var _items2 = sortKeys ? added.sort(_compareByKey2.default) : added;
        (0, _printer.subheader)('Added keys:');
        _items2.forEach(function (_ref4) {
          var key = _ref4.key,
              message = _ref4.message;
          return console.log('  ' + (0, _chalk.green)(key) + ': ' + (0, _chalk.cyan)(message));
        });
        (0, _printer.newLine)();
      }

      if (updated.length) {
        var _items3 = sortKeys ? updated.sort(_compareByKey2.default) : updated;
        (0, _printer.subheader)('Updated keys:');
        _items3.forEach(function (_ref5) {
          var key = _ref5.key,
              message = _ref5.message;
          return console.log('  ' + (0, _chalk.yellow)(key) + ': ' + (0, _chalk.cyan)(message));
        });
        (0, _printer.newLine)();
      }
    } else {}
  }
};

var printReportGroupedByLocal = exports.printReportGroupedByLocal = function printReportGroupedByLocal(reportDetails) {
  Object.keys(reportDetails).forEach(function (key) {
    var messagesArray = reportDetails[key];
    (0, _printer.header)('Maintaining ' + (0, _chalk.yellow)(key) + ':');
    messagesArray.forEach(function (message) {
      var key = Object.keys(message)[0];
      var type = message['type'];
      var content = message[key];
      console.log('  ' + (0, _chalk.yellow)(key) + ': ' + (0, _chalk.cyan)(content) + '  ' + (0, _chalk.cyan)('type') + ': ' + type);
    });
    (0, _printer.newLine)();
  });
};