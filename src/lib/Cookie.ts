import { IncomingMessage, ServerResponse } from 'http';
import { CookieConfig } from '../../index';

class Cookie {
    private readonly req: IncomingMessage;
    private readonly res: ServerResponse;
    private cookies: Map<any, any>;
    constructor(req: IncomingMessage,res: ServerResponse) {
        this.req = req;
        this.res = res;
        this.cookies = Cookie.initCookies(this.req.headers.cookie || '');
    }

    static initCookies(cookies: string): Map<any, any> {
        const cookiesSplit: string[] = cookies.split(';');
        const ret: Map<any, any> = new Map();
        if(cookiesSplit.length > 0) {
            cookiesSplit.forEach((cookie) => {
                const cookieSplit: string[] = cookie.split('=');
                if(cookieSplit.length > 1) {
                    ret.set(cookieSplit[0], cookieSplit[1]);
                }
            });
        }
        return ret;
    }

    public setCookie = (key: string, value: string, config?: CookieConfig): void => {
        const cookieChunk: any[] = [];
        cookieChunk.push(`${key}=${value}`);
        if(config) {
            if(config.HttpOnly) cookieChunk.push('HttpOnly');
            if(config.Expires) cookieChunk.push(config.Expires);
            if(config.Domain) cookieChunk.push(config.Domain);
            if(config.Path) cookieChunk.push(config.Path);
            if(config.MaxAge) cookieChunk.push(config.MaxAge);
            if(config.SameSite) cookieChunk.push(config.SameSite);
        }
        this.res.setHeader('Set-Cookie', cookieChunk.join('; '));
    }

    public getCookie = (key: string): any => {
        return this.cookies.get(key);
    }

    public getCookies = () => {
        const ret: Record<any,any> = {};
        this.cookies.forEach((value, key) => {
            ret[key] = value;
        });
        return ret;
    }

    public deleteCookie = (key: string) => {
        this.res.setHeader('Set-Cookie', `${key}=0 ; Expires=${new Date()}`);
    }

}

export { Cookie };
