import { green, yellow, red, cyan } from 'chalk';

import { newLine, subheader, header } from './printer';
import compareByKey from './compareByKey';

export default ({ deleted = [], untranslated = [], added = [], updated= [], sortKeys = true }) => {
  if (!(deleted.length || added.length || updated.length || untranslated.length)) {
    console.log(green('  Perfectly maintained, no remarks!'));
    newLine();
  } else {
    if (!reportGroupedByLocales) {
      if (deleted.length) {
        const items = sortKeys ? deleted.sort(compareByKey) : deleted;
        subheader('Deleted keys:');
        items.forEach(({ key, message }) =>
          console.log(`  ${red(key)}: ${cyan(message)}`)
        );
        newLine();
      }

      if (untranslated.length) {
        const items = sortKeys ? untranslated.sort(compareByKey) : untranslated;
        subheader('Untranslated keys:');
        items.forEach(({ key, message }) =>
          console.log(`  ${yellow(key)}: ${cyan(message)}`)
        );
        newLine();
      }

      if (added.length) {
        const items = sortKeys ? added.sort(compareByKey) : added;
        subheader('Added keys:');
        items.forEach(({ key, message }) =>
          console.log(`  ${green(key)}: ${cyan(message)}`)
        );
        newLine();
      }

      if (updated.length) {
        const items = sortKeys ? updated.sort(compareByKey) : updated;
        subheader('Updated keys:');
        items.forEach(({ key, message }) =>
          console.log(`  ${yellow(key)}: ${cyan(message)}`)
        );
        newLine();
      }
    } else {

    }
  }
};

export const printReportGroupedByLocal = (reportDetails) => {
  Object.keys(reportDetails).forEach((key) => {
    const messagesArray = reportDetails[key];
    header(`Maintaining ${yellow(key)}:`);
    messagesArray.forEach((message) => {
      const key = Object.keys(message)[0];
      const type = message['type'];
      const content = message[key];
      console.log(`  ${yellow(key)}: ${cyan(content)}  ${cyan('type')}: ${type}`)
    })
    newLine();
  })
}
