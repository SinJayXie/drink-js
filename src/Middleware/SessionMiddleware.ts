import { IncomingMessage, ServerResponse } from 'http';
import * as uuid from 'uuid';

interface SessionConfig {
    key: string,
    maxAge?: number,
    overwrite?: boolean,
    httpOnly?: boolean,
}

interface SessionRecord {
    expire: number,
    uuid: string,
    createTime: number,
    content: Record<string, any>
}

const SESSION_LIST: Map<string, SessionRecord> = new Map();
class SessionMiddleware {
    private config: SessionConfig;
    private cookie: Record<any, any>;
    constructor(config: SessionConfig) {
        this.config = config;
        this.config.maxAge = this.config.maxAge || 84600000;
        this.cookie = {};
    }

    public app(req: IncomingMessage, res: ServerResponse, next:Function) {
        this.cookie = this.parseCookie(req.headers.cookie || '');
        if(this.cookie['Drink-SESSION']) {
            if(!SESSION_LIST.has(this.cookie['Drink-SESSION'])) {
                req.headers.cookie += ';Drink-SESSION=' + this.setSession(res);
            } else {
                const session = SESSION_LIST.get(this.cookie['Drink-SESSION']);
                if(session.expire + this.config.maxAge < Date.now()) {
                    SESSION_LIST.delete(this.cookie['Drink-SESSION']);
                    req.headers.cookie += ';Drink-SESSION=' + this.setSession(res);
                }
            }
        } else {
            req.headers.cookie += ';Drink-SESSION=' + this.setSession(res);
        }

        next();
    }

    public setSession = (res: ServerResponse): string => {
        const session_uuid: string = uuid.v4();
        res.setHeader('Set-Cookie', 'Drink-SESSION=' + session_uuid);
        SESSION_LIST.set(session_uuid, {
            createTime: Date.now(),
            expire: Date.now() + this.config.maxAge,
            uuid: session_uuid,
            content: {}
        });
        return session_uuid;
    }

    public parseCookie = (cookie: string): Record<any, any> => {
        const ret: Record<any, any> = {};
        const split: string[] = cookie.split(';');
        split.forEach((cookieItem: string) => {
            const keyValueSplit: string[] = cookieItem.split('=');

            if(keyValueSplit.length === 2) {
                ret[keyValueSplit[0]] = keyValueSplit[1];
            }

        });
        return ret;
    }
}

export { SessionConfig, SessionMiddleware, SessionRecord, SESSION_LIST };
