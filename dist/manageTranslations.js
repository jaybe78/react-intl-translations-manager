'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n        No existing ', ' file found.\n        A new one is created.\n      '], ['\n        No existing ', ' file found.\n        A new one is created.\n      ']);

var _fs = require('fs');

var _mkdirp = require('mkdirp');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _readFile = require('./readFile');

var _readFile2 = _interopRequireDefault(_readFile);

var _printer = require('./printer');

var _readMessageFiles = require('./readMessageFiles');

var _readMessageFiles2 = _interopRequireDefault(_readMessageFiles);

var _createSingleMessagesFile = require('./createSingleMessagesFile');

var _createSingleMessagesFile2 = _interopRequireDefault(_createSingleMessagesFile);

var _printResults = require('./printResults');

var _printResults2 = _interopRequireDefault(_printResults);

var _stringify = require('./stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _writeReportFile = require('./writeReportFile');

var _writeReportFile2 = _interopRequireDefault(_writeReportFile);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var defaultJSONOptions = {
  space: 2,
  trailingNewline: false
};

exports.default = function (_ref) {
  var messagesDirectory = _ref.messagesDirectory,
      translationsDirectory = _ref.translationsDirectory,
      reportDirectory = _ref.reportDirectory,
      _ref$defaultLocale = _ref.defaultLocale,
      defaultLocale = _ref$defaultLocale === undefined ? 'en' : _ref$defaultLocale,
      _ref$whitelistsDirect = _ref.whitelistsDirectory,
      whitelistsDirectory = _ref$whitelistsDirect === undefined ? translationsDirectory : _ref$whitelistsDirect,
      _ref$whitelistsNeeded = _ref.whitelistsNeeded,
      whitelistsNeeded = _ref$whitelistsNeeded === undefined ? false : _ref$whitelistsNeeded,
      _ref$languages = _ref.languages,
      languages = _ref$languages === undefined ? [] : _ref$languages,
      _ref$singleMessagesFi = _ref.singleMessagesFile,
      singleMessagesFile = _ref$singleMessagesFi === undefined ? false : _ref$singleMessagesFi,
      _ref$detectDuplicateI = _ref.detectDuplicateIds,
      detectDuplicateIds = _ref$detectDuplicateI === undefined ? true : _ref$detectDuplicateI,
      _ref$sortKeys = _ref.sortKeys,
      sortKeys = _ref$sortKeys === undefined ? true : _ref$sortKeys,
      _ref$printReport = _ref.printReport,
      printReport = _ref$printReport === undefined ? true : _ref$printReport,
      _ref$jsonOptions = _ref.jsonOptions,
      jsonOptions = _ref$jsonOptions === undefined ? {} : _ref$jsonOptions,
      _ref$overridePrinters = _ref.overridePrinters,
      overridePrinters = _ref$overridePrinters === undefined ? {} : _ref$overridePrinters,
      _ref$overrideCoreMeth = _ref.overrideCoreMethods,
      overrideCoreMethods = _ref$overrideCoreMeth === undefined ? {} : _ref$overrideCoreMeth,
      reportGroupedByLocales = _ref.reportGroupedByLocales;

  //console.log('start translation process');
  if (!messagesDirectory || !translationsDirectory) {
    throw new Error('messagesDirectory and translationsDirectory are required');
  }

  var defaultPrinters = {
    printDuplicateIds: function printDuplicateIds(duplicateIds) {
      (0, _printer.header)('Duplicate ids:');
      if (duplicateIds.length) {
        duplicateIds.forEach(function (id) {
          console.log('  ', 'Duplicate message id: ' + (0, _chalk.red)(id));
        });
      } else {
        console.log((0, _chalk.green)('  No duplicate ids found, great!'));
      }
      (0, _printer.footer)();
    },

    printLanguageReport: function printLanguageReport(langResults) {
      (0, _printer.header)('Maintaining ' + (0, _chalk.yellow)(langResults.languageFilename) + ':');
      (0, _printResults2.default)(_extends({}, langResults.report, { sortKeys: sortKeys }));
    },
    printNoLanguageFile: function printNoLanguageFile(langResults) {
      (0, _printer.subheader)('\n        No existing ' + langResults.languageFilename + ' translation file found.\n        A new one is created.\n      ');
    },

    printNoLanguageWhitelistFile: function printNoLanguageWhitelistFile(langResults) {
      (0, _printer.subheader)(''(_templateObject2, langResults)(_templateObject));
    }
  };

  var printers = _extends({}, defaultPrinters, overridePrinters);

  var stringifyOpts = _extends({}, defaultJSONOptions, jsonOptions, {
    sortKeys: sortKeys
  });

  var defaultCoreMethods = {
    provideExtractedMessages: function provideExtractedMessages() {
      return (0, _readMessageFiles2.default)(messagesDirectory);
    },

    outputSingleFile: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(combinedFiles) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new Promise(function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
                    var modifiedKeys;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!singleMessagesFile) {
                              _context.next = 5;
                              break;
                            }

                            _context.next = 3;
                            return (0, _createSingleMessagesFile2.default)({
                              messages: combinedFiles,
                              directory: translationsDirectory,
                              fileName: defaultLocale + '.json',
                              sortKeys: sortKeys
                            });

                          case 3:
                            modifiedKeys = _context.sent;
                            return _context.abrupt('return', resolve(modifiedKeys));

                          case 5:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  }));

                  return function (_x2) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function outputSingleFile(_x) {
        return _ref2.apply(this, arguments);
      };
    }(),
    emitReportFile: function emitReportFile(reportDetails) {
      (0, _writeReportFile2.default)(reportDetails, reportDirectory);
    },
    outputDuplicateKeys: function outputDuplicateKeys(duplicateIds) {
      if (!detectDuplicateIds) return;
      printers.printDuplicateIds(duplicateIds);
    },

    beforeReporting: function beforeReporting() {
      if (reportDirectory.length > 0) {
        (0, _mkdirp.sync)(reportDirectory);
      }
      (0, _mkdirp.sync)(translationsDirectory);
      if (whitelistsNeeded) {
        (0, _mkdirp.sync)(whitelistsDirectory);
      }
    },

    provideLangTemplate: function provideLangTemplate(lang) {
      var languageFilename = lang + '.json';
      var languageFilepath = _path2.default.join(translationsDirectory, languageFilename);
      var whitelistFilename = 'whitelist_' + lang + '.json';
      var whitelistFilepath = _path2.default.join(whitelistsDirectory, whitelistFilename);

      return {
        lang: lang,
        languageFilename: languageFilename,
        languageFilepath: languageFilepath,
        whitelistFilename: whitelistFilename,
        whitelistFilepath: whitelistFilepath
      };
    },

    provideTranslationsFile: function provideTranslationsFile(langResults) {
      var jsonFile = (0, _readFile2.default)(langResults.languageFilepath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },

    provideWhitelistFile: function provideWhitelistFile(langResults) {
      var jsonFile = (0, _readFile2.default)(langResults.whitelistFilepath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },
    printLanguageReportByLocale: function printLanguageReportByLocale(reportDetails) {
      (0, _printResults.printReportGroupedByLocal)(reportDetails);
    },
    reportLanguage: function reportLanguage(langResults, printReport) {
      var reportGroupedByLocales = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      //console.log('inside function  reportLanguage');
      if (!langResults.report.noTranslationFile && !langResults.report.noWhitelistFile) {
        if (!reportGroupedByLocales && printReport) {
          printers.printLanguageReport(langResults);
        }
        (0, _fs.writeFileSync)(langResults.languageFilepath, (0, _stringify2.default)(langResults.report.fileOutput, stringifyOpts));
        if (whitelistsNeeded) {
          (0, _fs.writeFileSync)(langResults.whitelistFilepath, (0, _stringify2.default)(langResults.report.whitelistOutput, stringifyOpts));
        }
      } else {
        if (langResults.report.noTranslationFile) {
          printers.printNoLanguageFile(langResults);
          (0, _fs.writeFileSync)(langResults, (0, _stringify2.default)(langResults.report.fileOutput, stringifyOpts));
        }

        if (langResults.report.noWhitelistFile) {
          printers.printNoLanguageWhitelistFile(langResults);
          if (whitelistsNeeded) {
            (0, _fs.writeFileSync)(langResults.whitelistFilepath, (0, _stringify2.default)([], stringifyOpts));
          }
        }
      }
    },

    afterReporting: function afterReporting() {}
  };
  (0, _core2.default)(languages, _extends({}, defaultCoreMethods, overrideCoreMethods, {
    printReport: printReport,
    reportGroupedByLocales: reportGroupedByLocales
  }));
};