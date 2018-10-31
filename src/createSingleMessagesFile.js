import Path from 'path';
import { writeFileSync } from 'fs';
import { sync as mkdirpSync } from 'mkdirp';
import stringify from './stringify';
import writeReportFile from './writeReportFile';

const checkModifiedKeys =  (messages, path) =>  {
  const fs = require('fs');
  let changes = [];
  //check whether properties have changed
   return new Promise(function(resolve) {
    // Do async job
    if (fs.existsSync(path)) {
      //console.log(path);
      // check whether existing  keys have changed
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) throw err;
        const oldMessage = JSON.parse(data);
        changes =  Object.keys(oldMessage).reduce((acc, current) => {
          if (messages[current] !== oldMessage[current]) {
            acc.push({
              id: current,
              oldMessage: oldMessage[current],
              newMessage: messages[current],
            })
          }
          return acc;
        }, []);
        resolve(changes);
      });
    } else {
      resolve(changes);
    }
  });

}


export default  ({
  messages,
  directory,
  fileName = 'defaultMessages.json',
  sortKeys = true,
  jsonSpaceIndentation = 2
}) => {
  return new Promise(function(resolve) {
    if (!messages) {
      throw new Error('Messages are required');
    }

    if (!directory || typeof directory !== 'string' || directory.length === 0) {
      throw new Error('Directory is required');
    }
    const DIR = Path.join(directory, fileName);
    checkModifiedKeys(messages, DIR).then(function(changes) {
      //console.log('after checkModifiedKeys');
      mkdirpSync(directory);
      writeFileSync(
        DIR,
        stringify(messages, { space: jsonSpaceIndentation, sortKeys })
      );
      resolve(changes);
    });
  });
};


