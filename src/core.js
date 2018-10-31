import getDefaultMessages from './getDefaultMessages';
import getLanguageReport from './getLanguageReport';


const groupObjectBy = (obj, column) => {
  return Object.keys(obj).reduce((rv, messageKey) => {
    (rv[obj[messageKey][column]] = rv[obj[messageKey][column]] || [])
      .push({ [messageKey] : obj[messageKey]['message'], type: obj[messageKey]['type'] });
    return rv;
  }, {});
};

const getModifiedKeys = async (outputSingleFile, defaultMessages) => {
  let changedKeys = [];
    if (typeof outputSingleFile === 'function') {
      //outputSingleFile(extractedMessages);
      const simpleJson = Object.keys(defaultMessages.messages)
        .map((messageKey) => ({ [messageKey]: defaultMessages.messages[messageKey] }))
        .reduce((acc, current) => {
          return { ...acc, ...current };
        }, {});
      changedKeys = await outputSingleFile(simpleJson);
    }
  return changedKeys;
}

const reportChangesForOtherLocales = (hooks) => {
  const {
    provideLangTemplate,
    provideTranslationsFile,
    provideWhitelistFile,
    reportLanguage,
    defaultMessages,
    languages,
    printReport,
    modifiedKeys,
    emitReportFile,
    reportGroupedByLocales,
    printLanguageReportByLocale,
  } = hooks;
  let reportDetails = { };
  //console.log('languages', reportDetails);
  languages.forEach(lang => {
    const langResults = provideLangTemplate(lang);

    const localizedFile = provideTranslationsFile(langResults);
    const whitelistFile = provideWhitelistFile(langResults);

    if (!localizedFile) langResults.noTranslationFile = true;
    if (!whitelistFile) langResults.noWhitelistFile = true;

    //console.log('before function  getLanguageReport');
    langResults.report = getLanguageReport(
      defaultMessages.messages,
      localizedFile,
      whitelistFile,
      modifiedKeys,
    );

    const { added = [], untranslated = [], updated = [] } = langResults.report;
    const allChanges = added.concat(untranslated).concat(updated);
    allChanges.forEach(({ key: messageId, message, type }) => {
      const untranslatedMessageKey = Object.keys(reportDetails).find((key) => {
        //console.log(key)
        return (key === messageId)
      });
      if (untranslatedMessageKey) {
        let existingLocales = reportDetails[messageId]['missing-translation-in-locales'];
        existingLocales.push(lang);
        reportDetails = {
          ...reportDetails,
          [messageId]: {
            ...reportDetails[messageId],
            'missing-translation-in-locales': existingLocales,
            type,
          }
        };
      } else {
        reportDetails = {
          ...reportDetails,
          [messageId]: {
            message,
            'missing-translation-in-locales': [ lang ],
            type,
          }
        };
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
}

export default async (languages, hooks) => {
  const {
    provideExtractedMessages,
    outputSingleFile,
    outputDuplicateKeys,
    beforeReporting,
    afterReporting,
  } = hooks;

  const extractedMessages = provideExtractedMessages();
  const defaultMessages = await getDefaultMessages(extractedMessages);
  //console.log('before function  getModifiedKeys');
  const modifiedKeys = await getModifiedKeys(outputSingleFile, defaultMessages);
  //console.log('after function getModifiedKeys');
  if (typeof outputDuplicateKeys === 'function') {
    //console.log('before function  outputDuplicateKeys');
    await outputDuplicateKeys(defaultMessages.duplicateIds);
    //console.log('after function  outputDuplicateKeys');
  }

  if (typeof beforeReporting === 'function') beforeReporting();
  //console.log('before function  reportChangesForOtherLocales');
  await reportChangesForOtherLocales({
    ...hooks,
    defaultMessages,
    languages,
    modifiedKeys,
  });



  if (typeof afterReporting === 'function') afterReporting();
};
