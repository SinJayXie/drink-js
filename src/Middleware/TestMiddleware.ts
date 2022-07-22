import { IncomingMessage, ServerResponse } from 'http';

class TestMiddleware {
    constructor() {
    }

    public app = (req: IncomingMessage,res: ServerResponse,next: Function) => {
        console.log('test');
        next();
    }
}

export { TestMiddleware };
