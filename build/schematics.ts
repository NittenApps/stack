import { copyDirSync, exec } from './util';

exec('cd schematics && npm run build');
copyDirSync('schematics', 'dist/nittenapps/schematics');
