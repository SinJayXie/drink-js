import { IncomingMessage, ServerResponse } from 'http';
import { Cookie } from './Cookie';
import { loader, LoaderList } from '../Plugins/loader';
import { getRouteArgs, ConversionBuffer } from './Uitls';
import { SESSION_LIST, SessionRecord } from '../Middleware/SessionMiddleware';
import { RouteArgsData } from '../../index';
import { TemplateEjs } from './TemplateEjs';
import { MethodsType } from './DocsApi';
class DrinkBase {
    private readonly serverResponse: ServerResponse;
    private readonly clientRequest: IncomingMessage;
    public readonly cookie: Cookie;
    public readonly plugins: LoaderList;
    public readonly session: SessionRecord;
    private readonly route: RouteArgsData;
    public template: TemplateEjs;
    public readonly env: string;
    private body: Record<any, any>;
    constructor(req: IncomingMessage, res: ServerResponse, route: RouteArgsData, body: Record<any, any>,env: string) {
        this.serverResponse = res;
        this.clientRequest = req;
        this.cookie = new Cookie(req, res);
        this.plugins = loader;
        this.route = route;
        this.env = env;
        this.body = body;
        this.session = SESSION_LIST.get(this.cookie.getCookie('Drink-SESSION'));
        this.template = new TemplateEjs(this.route, this);
    }

    /**
     * Get http request header for key
     * use this.drink.getHeader("key") return string
     * @param key
     */
    public getHeader = (key: string) => {
        return this.clientRequest.headers[key] || '';
    }

    /**
     * Set http response header
     * use this.drink.setHeader("key", "value")
     * @param key
     * @param value
     */
    public setHeader = (key: string, value: string) => {
        return this.serverResponse.setHeader(key, value);
    }

    /**
     * Set request method
     * @param method
     */
    public setMethod = (method: MethodsType | string) => {
        if(method.toUpperCase() === this.clientRequest.method.toUpperCase()) return true;
        this.funcReturn(this.fail(`Not arrow "${this.clientRequest.method.toUpperCase()}" method`,405));
    }

    public getBody = (bodyKeys: string[]) => {
        const params_: Record<string, any> = {};
        for (const key in this.body) {
            if(this.body[key]) {
                params_[key] = this.body[key];
            } else {
                this.funcReturn(this.fail(`Body '${key}' cannot be empty`));
            }
        }
        return params_;
    }

    /**
     * Get url params
     * example http://host:port/query?a=1&b=2
     * use this.drink.getParams(['a','b']) return {a:1, b:2} Record<any, any>
     * @param params
     * return Record<any, any>
     */
    public getParams = (params: string[]): Record<any, any> => {
        const { query } = getRouteArgs(this.clientRequest.url);
        const params_: Record<string, any> = {};
        params.forEach((key: string) => {
            if(query[key]) {
                params_[key] = query[key];
            } else {
                this.funcReturn(this.fail(`Parameter '${key}' cannot be empty`));
            }
        });
        return params_;
    }

    /**
     * Return Define data stop Router return
     * @param data
     */
    public funcReturn = (data?: any) => {
        const result = ConversionBuffer(data);
        if(result) {
            this.serverResponse.statusCode = 200;
            this.serverResponse.end(result);
        }
        throw Error('USER_DEFINE_RESPONSE');
    }

    /**
     * Set client session
     * use this.drink.setSession('key', 'value') return void
     * @param key
     * @param value
     * return void
     */
    public setSession = (key: string, value: any): void => {
        this.session.content[key] = value;
    }

    /**
     * Get client session
     * use this.drink.getSession('key') return any
     * @param key
     * return any
     */
    public getSession = (key: string): any => {
        return this.session.content[key];
    }

    /**
     * Make success json
     * use this.drink.success(object | string | number ...)
     * @param data
     */
    public success = (data?: any) => {
        return {
            code: 200,
            data,
            msg: 'ok',
            success: true,
            time: Date.now()
        };
    }

    /**
     * Make fail json
     * use this.drink.fail('msg', 200)
     * @param msg
     * @param status
     */
    public fail = (msg: string ,status?: number) => {
        this.serverResponse.statusCode = status || 200;
        return {
            code: status || 200,
            msg,
            success: false,
            time: Date.now()
        };
    }

}

export default DrinkBase;
