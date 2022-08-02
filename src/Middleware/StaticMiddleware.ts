import { IncomingMessage, ServerResponse } from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { MimeType } from '../lib/MimeType';
import { parse } from 'url';
import * as events from 'events';
import { getRunningEnvironment } from '../lib/Uitls';

events.EventEmitter.defaultMaxListeners = 100;

const staticPath = getRunningEnvironment() === 'prod' ? path.join(__dirname, '..') : path.join(__dirname, '../../src');
class StaticMiddleware {
    private mime: MimeType;
    constructor() {
        this.mime = new MimeType();
    }

    public app = (req: IncomingMessage,res: ServerResponse,next: Function) => {
        if(req.url.indexOf('/static') === 0) {
            const { pathname } = parse(req.url);
            const staticFile = path.join(staticPath, pathname);
            if(fs.existsSync(staticFile)) {
                const stat = fs.statSync(staticFile);
                if(stat.isDirectory()) {
                    next();
                } else {
                    res.setHeader('Content-Type', this.mime.getFileType(staticFile));
                    res.setHeader('Content-Length', stat.size);
                    const readStream = fs.createReadStream(staticFile, {
                        highWaterMark: 40
                    });
                    readStream.on('open', () => {
                        res.on('close', () => {
                            readStream.close();
                        });
                    });

                    readStream.on('data', (chunk) => {
                        res.write(chunk);
                    });

                    readStream.on('end', () => {
                        res.end();
                        readStream.close();
                    });
                }
            } else {
                next();
            }
        } else {
            next();
        }
    }
}

export { StaticMiddleware };
