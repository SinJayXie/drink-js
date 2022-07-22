import { IncomingMessage, ServerResponse } from 'http';

class StaticMiddleware {
    constructor() {
    }

    public app = (req: IncomingMessage,res: ServerResponse,next: Function) => {
        if(req.url.indexOf('/static') === 0) {
            res.end('static');
        } else {
            next();
        }
    }
}

export { StaticMiddleware };
