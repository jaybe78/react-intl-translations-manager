'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _getDefaultMessages = require('./getDefaultMessages');

var _getDefaultMessages2 = _interopRequireDefault(_getDefaultMessages);

var _getLanguageReport = require('./getLanguageReport');

var _getLanguageReport2 = _interopRequireDefault(_getLanguageReport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var groupObjectBy = function groupObjectBy(obj, column) {
  return Object.keys(obj).reduce(function (rv, messageKey) {
    var _push;

    (rv[obj[messageKey][column]] = rv[obj[messageKey][column]] || []).push((_push = {}, _defineProperty(_push, messageKey, obj[messageKey]['message']), _defineProperty(_push, 'type', obj[messageKey]['type']), _push));
    return rv;
  }, {});
};

var getModifiedKeys = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(outputSingleFile, defaultMessages) {
    var changedKeys, simpleJson;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            changedKeys = [];

            if (!(typeof outputSingleFile === 'function')) {
              _context.next = 6;
              break;
            }

            //outputSingleFile(extractedMessages);
            simpleJson = Object.keys(defaultMessages.messages).map(function (messageKey) {
              return _defineProperty({}, messageKey, defaultMessages.messages[messageKey]);
            }).reduce(function (acc, current) {
              return _extends({}, acc, current);
            }, {});
            _context.next = 5;
            return outputSingleFile(simpleJson);

          case 5:
            changedKeys = _context.sent;

          case 6:
            return _context.abrupt('return', changedKeys);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getModifiedKeys(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var reportChangesForOtherLocales = function reportChangesForOtherLocales(hooks) {
  var provideLangTemplate = hooks.provideLangTemplate,
      provideTranslationsFile = hooks.provideTranslationsFile,
      provideWhitelistFile = hooks.provideWhitelistFile,
      reportLanguage = hooks.reportLanguage,
      defaultMessages = hooks.defaultMessages,
      languages = hooks.languages,
      printReport = hooks.printReport,
      modifiedKeys = hooks.modifiedKeys,
      emitReportFile = hooks.emitReportFile,
      reportGroupedByLocales = hooks.reportGroupedByLocales,
      printLanguageReportByLocale = hooks.printLanguageReportByLocale;

  var reportDetails = {};
  //console.log('languages', reportDetails);
  languages.forEach(function (lang) {
    var langResults = provideLangTemplate(lang);

    var localizedFile = provideTranslationsFile(langResults);
    var whitelistFile = provideWhitelistFile(langResults);

    if (!localizedFile) langResults.noTranslationFile = true;
    if (!whitelistFile) langResults.noWhitelistFile = true;

    //console.log('before function  getLanguageReport');
    langResults.report = (0, _getLanguageReport2.default)(defaultMessages.messages, localizedFile, whitelistFile, modifiedKeys);

    var _langResults$report = langResults.report,
        _langResults$report$a = _langResults$report.added,
        added = _langResults$report$a === undefined ? [] : _langResults$report$a,
        _langResults$report$u = _langResults$report.untranslated,
        untranslated = _langResults$report$u === undefined ? [] : _langResults$report$u,
        _langResults$report$u2 = _langResults$report.updated,
        updated = _langResults$report$u2 === undefined ? [] : _langResults$report$u2;

    var allChanges = added.concat(untranslated).concat(updated);
    allChanges.forEach(function (_ref3) {
      var messageId = _ref3.key,
          message = _ref3.message,
          type = _ref3.type;

      var untranslatedMessageKey = Object.keys(reportDetails).find(function (key) {
        //console.log(key)
        return key === messageId;
      });
      if (untranslatedMessageKey) {
        var existingLocales = reportDetails[messageId]['missing-translation-in-locales'];
        existingLocales.push(lang);
        reportDetails = _extends({}, reportDetails, _defineProperty({}, messageId, _extends({}, reportDetails[messageId], {
          'missing-translation-in-locales': existingLocales,
          type: type
        })));
      } else {
        reportDetails = _extends({}, reportDetails, _defineProperty({}, messageId, {
          message: message,
          'missing-translation-in-locales': [lang],
          type: type
        }));
      }
    });
    if (typeof reportLanguage === 'function') {
      reportLanguage(langResults, printReport, reportGroupedByLocales);
    }
  });
  reportDetails = groupObjectBy(reportDetails, 'missing-translation-in-locales');
  if (reportGroupedByLocales) {
    printLanguageReportByLocale(reportDetails);
  }
  emitReportFile(reportDetails);
  return reportDetails;
};

exports.default = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(languages, hooks) {
    var provideExtractedMessages, outputSingleFile, outputDuplicateKeys, beforeReporting, afterReporting, extractedMessages, defaultMessages, modifiedKeys;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            provideExtractedMessages = hooks.provideExtractedMessages, outputSingleFile = hooks.outputSingleFile, outputDuplicateKeys = hooks.outputDuplicateKeys, beforeReporting = hooks.beforeReporting, afterReporting = hooks.afterReporting;
            extractedMessages = provideExtractedMessages();
            _context2.next = 4;
            return (0, _getDefaultMessages2.default)(extractedMessages);

          case 4:
            defaultMessages = _context2.sent;
            _context2.next = 7;
            return getModifiedKeys(outputSingleFile, defaultMessages);

          case 7:
            modifiedKeys = _context2.sent;

            if (!(typeof outputDuplicateKeys === 'function')) {
              _context2.next = 11;
              break;
            }

            _context2.next = 11;
            return outputDuplicateKeys(defaultMessages.duplicateIds);

          case 11:

            if (typeof beforeReporting === 'function') beforeReporting();
            //console.log('before function  reportChangesForOtherLocales');
            _context2.next = 14;
            return reportChangesForOtherLocales(_extends({}, hooks, {
              defaultMessages: defaultMessages,
              languages: languages,
              modifiedKeys: modifiedKeys
            }));

          case 14:

            if (typeof afterReporting === 'function') afterReporting();

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();