import { writeFileSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
import Path from 'path';
import { yellow, red, green } from 'chalk';

import readFile from './readFile';
import { header, subheader, footer } from './printer';
import readMessageFiles from './readMessageFiles';
import createSingleMessagesFile from './createSingleMessagesFile';
import printResults from './printResults';
import { printReportGroupedByLocal } from './printResults'
import stringify from './stringify';
import writeReportFile from './writeReportFile';
import core from './core';

const defaultJSONOptions = {
  space: 2,
  trailingNewline: false
};

export default ({
  messagesDirectory,
  translationsDirectory,
  reportDirectory,
  defaultLocale = 'en',
  whitelistsDirectory = translationsDirectory,
  whitelistsNeeded = false,
  languages = [],
  detectDuplicateIds = true,
  sortKeys = true,
  printReport = true,
  jsonOptions = {},
  overridePrinters = {},
  overrideCoreMethods = {},
  reportGroupedByLocales,
}) => {
  //console.log('start translation process');
  if (!messagesDirectory || !translationsDirectory) {
    throw new Error('messagesDirectory and translationsDirectory are required');
  }

  const defaultPrinters = {
    printDuplicateIds: duplicateIds => {
      header('Duplicate ids:');
      if (duplicateIds.length) {
        duplicateIds.forEach(id => {
          console.log('  ', `Duplicate message id: ${red(id)}`);
        });
      } else {
        console.log(green('  No duplicate ids found, great!'));
      }
      footer();
    },

    printLanguageReport: langResults => {
      header(`Maintaining ${yellow(langResults.languageFilename)}:`);
      printResults({ ...langResults.report, sortKeys });
    },
    printNoLanguageFile: langResults => {
      subheader(`
        No existing ${langResults.languageFilename} translation file found.
        A new one is created.
      `);
    },

    printNoLanguageWhitelistFile: langResults => {
      subheader(
        ```
        No existing ${langResults} file found.
        A new one is created.
      ```
      );
    }
  };

  const printers = {
    ...defaultPrinters,
    ...overridePrinters
  };

  const stringifyOpts = {
    ...defaultJSONOptions,
    ...jsonOptions,
    sortKeys
  };

  const defaultCoreMethods = {
    provideExtractedMessages: () => readMessageFiles(messagesDirectory),

    outputSingleFile: async combinedFiles => {
      return new Promise(async function(resolve) {
          const modifiedKeys = await createSingleMessagesFile({
            messages: combinedFiles,
            directory: translationsDirectory,
            fileName: defaultLocale + '.json',
            sortKeys
          });
          //console.log('modifiedKeys output: ', modifiedKeys);
          return resolve(modifiedKeys);
      });

    },
    emitReportFile: (reportDetails) => {
      writeReportFile(reportDetails, reportDirectory);
    },
    outputDuplicateKeys: duplicateIds => {
      if (!detectDuplicateIds) return;
      printers.printDuplicateIds(duplicateIds);
    },

    beforeReporting: () => {
      if (reportDirectory.length > 0) {
        mkdirpSync(reportDirectory);
      }
      mkdirpSync(translationsDirectory);
      if (whitelistsNeeded) {
        mkdirpSync(whitelistsDirectory);
      }
    },

    provideLangTemplate: lang => {
      const languageFilename = `${lang}.json`;
      const languageFilepath = Path.join(
        translationsDirectory,
        languageFilename
      );
      const whitelistFilename = `whitelist_${lang}.json`;
      const whitelistFilepath = Path.join(
        whitelistsDirectory,
        whitelistFilename
      );

      return {
        lang,
        languageFilename,
        languageFilepath,
        whitelistFilename,
        whitelistFilepath
      };
    },

    provideTranslationsFile: langResults => {
      const jsonFile = readFile(langResults.languageFilepath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },

    provideWhitelistFile: langResults => {
      const jsonFile = readFile(langResults.whitelistFilepath);
      return jsonFile ? JSON.parse(jsonFile) : undefined;
    },
    printLanguageReportByLocale: (reportDetails) => {
      printReportGroupedByLocal(reportDetails);
    },
    reportLanguage: (langResults, printReport,reportGroupedByLocales = false) => {
      //console.log('inside function  reportLanguage');
      if (
        !langResults.report.noTranslationFile &&
        !langResults.report.noWhitelistFile
      ) {
        if (!reportGroupedByLocales && printReport) {
          printers.printLanguageReport(langResults);
        }
        writeFileSync(
          langResults.languageFilepath,
          stringify(langResults.report.fileOutput, stringifyOpts)
        );
        if (whitelistsNeeded) {
          writeFileSync(
            langResults.whitelistFilepath,
            stringify(langResults.report.whitelistOutput, stringifyOpts)
          );
        }
      } else {
        if (langResults.report.noTranslationFile) {
          printers.printNoLanguageFile(langResults);
          writeFileSync(
            langResults,
            stringify(langResults.report.fileOutput, stringifyOpts)
          );
        }

        if (langResults.report.noWhitelistFile) {
          printers.printNoLanguageWhitelistFile(langResults);
          if (whitelistsNeeded) {
            writeFileSync(
              langResults.whitelistFilepath,
              stringify([], stringifyOpts)
            );
          }
        }
      }
    },

    afterReporting: () => {}
  };
  core(languages, {
    ...defaultCoreMethods,
    ...overrideCoreMethods,
    printReport,
    reportGroupedByLocales,
  });
};
