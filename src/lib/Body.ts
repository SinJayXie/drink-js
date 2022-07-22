import * as multiparty from 'multiparty';
import { IncomingMessage } from 'http';
const MAX_SIZE = 10 * 1024 * 1024;
const createBody = function (req: IncomingMessage): Promise<Record<any, any>> {
    return new Promise((resolve, reject) => {
        const contentType = req.headers['content-type'];
        if(req.method.toLowerCase() !== 'post' || contentType === undefined) {
            resolve({});
            return true;
        }
        try {
            if(contentType.indexOf('multipart/form-data') === 0) {
                createFormData(req, resolve);
            } else if(contentType.indexOf('application/x-www-form-urlencoded') === 0) {
                xWwwFormUrlencoded(req, resolve);
            } else if(contentType.indexOf('application/json') === 0) {
                createJson(req, resolve);
            } else {
                resolve({});
            }

        } catch (e) {
            reject(e);
        }
    });
};

const createBufferData = function (req: IncomingMessage, cb: Function) {
    const buffer = Buffer.alloc(MAX_SIZE); // 10MB 大小
    let currentLength = 0;
    req.on('data', (chunk) => {
        buffer.set(chunk, currentLength);
        currentLength += chunk.length;
    });
    req.on('error', (err) => {
        throw err;
    });
    req.on('end', () => {
        cb({
            buffer: buffer.slice(0, currentLength)
        });
    });
};

const createJson = function (req: IncomingMessage, cb: Function) {
    const buffer = Buffer.alloc(MAX_SIZE);
    let currentLength = 0;
    req.on('data', (chunk) => {
        buffer.set(chunk, currentLength);
        currentLength += chunk.length;
    });

    req.on('error', (err) => {
        throw err;
    });
    req.on('end', () => {
        const jsonStr = buffer.slice(0, currentLength).toString();
        try {
            cb(JSON.parse(jsonStr));
        } catch (e) {
            console.log(e.message);
            cb({});
        }
    });
};

const xWwwFormUrlencoded = function (req: IncomingMessage, cb: Function) {
    const buffer = Buffer.alloc(MAX_SIZE);
    let chunkLength = 0;
    req.on('data', (chunk) => {
        buffer.set(chunk, chunkLength);
        chunkLength += chunk.length;
    });
    req.on('error', (err) => {
        throw err;
    });
    req.on('end', () => {
        const realBuffer = buffer.slice(0, chunkLength);
        const textBuffer = realBuffer.toString();
        const paramsText = textBuffer.split('&');
        const ret: Record<any, any> = {};
        paramsText.forEach((args) => {
            const argsSplit = args.split('=');
            if(argsSplit.length > 1) {
                ret[argsSplit[0]] = argsSplit[1];
            }
        });
        cb(ret);
    });
};

const createFormData = function (req: IncomingMessage, cb: Function) {
    const form = new multiparty.Form();
    form.parse(req, (error, fields, files) => {
        if(error) {
            throw error;
        } else {
            cb({
                ...fields,
                ...files
            });
        }
    });
};

export {
    createBody
};
