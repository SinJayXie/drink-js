import { PluginBase } from '../PluginBase';
import DrinkBase from '../../lib/DrinkBase';
interface TokenInfoRecord {
    expire: number,
    token: string
}
class AuthPlugin extends PluginBase{
    private tokenList: Map<any, TokenInfoRecord>;
    constructor() {
        super();
        this.tokenList = new Map();
        this.tokenList.set('debug_test', {
            expire: Date.now() + 60 * 60 * 1000,
            token: 'debug_test'
        });
    }

    public isAuth = (drink: DrinkBase) => {
        const Authorization = drink.getHeader('authorization');
        if(this.tokenList.has(Authorization)) {
            const token = this.tokenList.get(Authorization);
            if(token.expire > Date.now()) {
                return Authorization;
            } else {
                this.tokenList.delete(Authorization);
                drink.funcReturn(drink.fail('Unauthorized request', 405));
            }
        } else {
            drink.funcReturn(drink.fail('Unauthorized request', 405));
        }
    }

    public setToken = (token: string) => {
        this.tokenList.set(token, {
            expire: Date.now() + 10 * 60 * 1000, // 10分钟过期
            token
        });
    }

    public removeToken = (token: string) => {
        this.tokenList.delete(token);
    }

    public resetExpire = (token: string) => {
        this.tokenList.set(token, {
            expire: Date.now() + 10 * 60 * 1000, // 10分钟过期
            token
        });
    }
}

export { AuthPlugin };
