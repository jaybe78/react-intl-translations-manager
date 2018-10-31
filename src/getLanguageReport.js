// returns stats for a specific language
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
import { MODIFIED_KEY, MESSAGE_ACTION_TYPE  } from './constants';
export const getCleanReport = () => ({
  added: [],
  untranslated: [],
  updated: [],
  deleted: [],
  fileOutput: {},
  whitelistOutput: []
});

export default (
  defaultMessages,
  languageMessages = {},
  languageWhitelist = [],
  modifiedKeys,
) => {
  //console.log('inside function  getLanguageReport');
  const result = getCleanReport();

  const defaultMessageKeys = Object.keys(defaultMessages);

  defaultMessageKeys.forEach(key => {
    const oldMessage = languageMessages[key];
    const defaultMessage = defaultMessages[key];
    if (oldMessage) {
      if (oldMessage.indexOf(MODIFIED_KEY) < 0) {
        result.fileOutput[key] = oldMessage;
        //if key contains ___TODO: MESSAGE HAS BEEN  CHANGED: PLEASE TRANSLATE AGAIN___ add it to report file
        const updatedKey = modifiedKeys.filter(({ id }) => (id === key));
        //update
        if (updatedKey.length > 0) {
          //check whether it's already been updated or not
          result.fileOutput[key] = result.fileOutput[key] + MODIFIED_KEY;
          result.updated.push({
            key,
            oldMessage,
            message: defaultMessage,
            type: MESSAGE_ACTION_TYPE.UPDATE,
          });
        }
        //untranslated
        else if (oldMessage === defaultMessage) {
          result.fileOutput[key] = oldMessage;
          if (languageWhitelist.indexOf(key) === -1) {
            result.untranslated.push({
              key,
              message: defaultMessage,
              type: MESSAGE_ACTION_TYPE.UNTRANSLATED,
            });
          } else {
            result.whitelistOutput.push(key);
          }
        }
      } else {
        result.fileOutput[key] = defaultMessage + MODIFIED_KEY;
        //already contains flag
        result.updated.push({
          key,
          oldMessage,
          message: defaultMessage,
          type: MESSAGE_ACTION_TYPE.UPDATE,
        });
      }

      // new key
    } else {
      result.fileOutput[key] = defaultMessage;
      result.added.push({
        key,
        message: defaultMessage,
        type: MESSAGE_ACTION_TYPE.NEW,
      });
    }
  });

  // if the key is still in the language file but no longer in the
  // defaultMessages file, then the key was deleted.
  result.deleted = Object.keys(languageMessages)
    .filter(key => defaultMessageKeys.indexOf(key) === -1)
    .map(key => ({
      key,
      message: languageMessages[key]
    }));

  return result;
};
