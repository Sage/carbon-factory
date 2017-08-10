import fs from 'fs';
import gracefulFs from 'graceful-fs';

gracefulFs.gracefulify(fs);
