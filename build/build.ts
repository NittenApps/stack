import * as fs from 'fs';
import { exec, PACKAGES } from './util';

const mainPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const distDir = 'dist/nittenapps';

// cleanup
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

PACKAGES.map((name) => {
  // build package
  exec(name === 'schematics' ? `ts-node --dir build schematics.ts` : `ng build @nittenapps/${name}`);

  const pkgDir = `${distDir}/${name}`;
  fs.copyFile('README.md', `${pkgDir}/README.md`, (err) => {
    if (err) throw err;
  });

  // update `STACK-VERSION`in package.json for all sub-packages
  const pkgPath = `${pkgDir}/package.json`;
  const pkgJson = {
    ...JSON.parse(fs.readFileSync(pkgPath, 'utf8')),
    version: mainPkg.version,
    homepage: mainPkg.homepage,
    description: mainPkg.description,
    repository: mainPkg.repository,
    bugs: mainPkg.bugs,
  };

  if (pkgJson.peerDependencies && pkgJson.peerDependencies['@nittenapps/common']) {
    pkgJson.peerDependencies['@nittenapps/common'] = mainPkg.version;
  }

  if (pkgJson.peerDependencies && pkgJson.peerDependencies['@nittenapps/forms']) {
    pkgJson.peerDependencies['@nittenapps/forms'] = mainPkg.version;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
});
