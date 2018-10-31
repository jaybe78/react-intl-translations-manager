/**
 * Created by i315756 on 10/31/18.
 */
const fs = require('fs');
import Path from 'path';
import { writeFileSync } from 'fs';

export default (obj, directory) => {
  const REPORT_DIR = Path.join(directory, 'report.json');

  const json = JSON.stringify(obj, null, '\t');

  writeFileSync(REPORT_DIR, json);
}
