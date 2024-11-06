import * as fs from 'fs';
import * as path from 'path';

const mainPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const file = 'projects/nittenapps/api/src/lib/version.ts';
const src = `export const version = '${mainPkg.version}'`;

fs.writeFile(file, src, (err) => {
  if (err) {
    console.error(err);
  }
});
