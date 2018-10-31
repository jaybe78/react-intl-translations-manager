'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCleanReport = undefined;

var _constants = require('./constants');

var getCleanReport = exports.getCleanReport = function getCleanReport() {
  return {
    added: [],
    untranslated: [],
    updated: [],
    deleted: [],
    fileOutput: {},
    whitelistOutput: []
  };
}; // returns stats for a specific language
// - added: contains all added messages
// - untranslated: contains all untranslated messages
// - deleted: contains all deleted messages
// - fileOutput: contains output for the new language file
//               a single object with all added and untranslated messages
//               in a key (messageKey) value (message) format
// - whitelistOutput: contains output for the new languageWhitelist file
//                    all previously whitelisted keys, without the deleted keys
//
// {
//   added: [],
//   untranslated: [],
//   deleted: [],
//   fileOutput: {},
//   whitelistOutput: [],
// }
//
// every message is declared in the following format
// {
//   key: 'unique_message_key',
//   message: 'specific_message',
// }

exports.default = function (defaultMessages) {
  var languageMessages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var languageWhitelist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var modifiedKeys = arguments[3];

  //console.log('inside function  getLanguageReport');
  var result = getCleanReport();

  var defaultMessageKeys = Object.keys(defaultMessages);

  defaultMessageKeys.forEach(function (key) {
    var oldMessage = languageMessages[key];
    var defaultMessage = defaultMessages[key];
    if (oldMessage) {
      if (oldMessage.indexOf(_constants.MODIFIED_KEY) < 0) {
        result.fileOutput[key] = oldMessage;
        //if key contains ___TODO: MESSAGE HAS BEEN  CHANGED: PLEASE TRANSLATE AGAIN___ add it to report file
        var updatedKey = modifiedKeys.filter(function (_ref) {
          var id = _ref.id;
          return id === key;
        });
        //update
        if (updatedKey.length > 0) {
          //check whether it's already been updated or not
          result.fileOutput[key] = result.fileOutput[key] + _constants.MODIFIED_KEY;
          result.updated.push({
            key: key,
            oldMessage: oldMessage,
            message: defaultMessage,
            type: _constants.MESSAGE_ACTION_TYPE.UPDATE
          });
        }
        //untranslated
        else if (oldMessage === defaultMessage) {
            result.fileOutput[key] = oldMessage;
            if (languageWhitelist.indexOf(key) === -1) {
              result.untranslated.push({
                key: key,
                message: defaultMessage,
                type: _constants.MESSAGE_ACTION_TYPE.UNTRANSLATED
              });
            } else {
              result.whitelistOutput.push(key);
            }
          }
      } else {
        result.fileOutput[key] = defaultMessage + _constants.MODIFIED_KEY;
        //already contains flag
        result.updated.push({
          key: key,
          oldMessage: oldMessage,
          message: defaultMessage,
          type: _constants.MESSAGE_ACTION_TYPE.UPDATE
        });
      }

      // new key
    } else {
      result.fileOutput[key] = defaultMessage;
      result.added.push({
        key: key,
        message: defaultMessage,
        type: _constants.MESSAGE_ACTION_TYPE.NEW
      });
    }
  });

  // if the key is still in the language file but no longer in the
  // defaultMessages file, then the key was deleted.
  result.deleted = Object.keys(languageMessages).filter(function (key) {
    return defaultMessageKeys.indexOf(key) === -1;
  }).map(function (key) {
    return {
      key: key,
      message: languageMessages[key]
    };
  });

  return result;
};