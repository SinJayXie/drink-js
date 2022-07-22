import { IncomingMessage, ServerResponse } from 'http';
import { CookieConfig } from '../../index';
import { Cookie } from './Cookie';
import { loader, LoaderList } from '../Plugins/loader';

class DrinkBase {
    private readonly serverResponse: ServerResponse;
    private readonly clientRequest: IncomingMessage;
    public readonly cookie: Cookie;
    public readonly plugins: LoaderList;
    constructor(req: IncomingMessage,res: ServerResponse) {
        this.serverResponse = res;
        this.clientRequest = req;
        this.cookie = new Cookie(req, res);
        this.plugins = loader;
    }

    public getHeader = (key: string) => {
        return this.clientRequest.headers[key];
    }

    public setHeader = (key: string, value: string) => {
        return this.serverResponse.setHeader(key, value);
    }
}

export default DrinkBase;
