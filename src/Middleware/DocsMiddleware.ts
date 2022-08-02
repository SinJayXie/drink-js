import * as fs from 'fs';
import * as path from 'path';
import { IncomingMessage, ServerResponse } from 'http';
class DocsMiddleware {
    private readonly docList: Record<string, any>[];
    private readonly dirName: string;
    constructor() {
        this.dirName = path.join(__dirname, '../docs');
        this.docList = this.loadDocs();
    }

    public loadDocs = (): Record<string, any>[] => {
        const list: any[] = [];
        if(fs.existsSync(this.dirName)) {
            const docFiles = fs.readdirSync(this.dirName);
            docFiles.forEach((name) => {
                if(path.extname(name) === '.js') {
                    const jsPath = path.join(this.dirName, name);
                    try {
                        // eslint-disable-next-line global-require
                        const docJs = require(jsPath);
                        list.push(docJs.default);
                    } catch (e) {
                        console.warn(e);
                    }
                }
            });
            return list;
        } else {
            return [];
        }
    }

    public app = (req: IncomingMessage, res: ServerResponse, next: Function) => {
        if(req.url.indexOf('/getDocList') === 0) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({
                code: 200,
                data: this.docList,
                success: true,
                msg: 'ok',
                time: Date.now()
            }));
        } else if(req.url.indexOf('/doc.html') === 0) {
            res.end('doc');
        } else {
            next();
        }
    }
}

export { DocsMiddleware };
