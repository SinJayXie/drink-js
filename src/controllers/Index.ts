import * as DrinkJs from '../lib/DrinkJs';
import { DrinkResponse } from '../../index';
class Index extends DrinkJs.Controller {
    private readonly res: DrinkResponse;
    constructor(res: DrinkResponse) {
        super(res);
        this.res = res;
    }

    public index = async () => {
        const userId = this.res.query.id;
        if(userId) {
            const result: any = await this.drink.plugins.MysqlUtils.select('lottery_user').fields(['id','username']).where(['id'],[userId]);
            if(result) {
                return { code: 200, data: result[0], msg: 'ok', success: true };
            }
            return { code: 200, data: null, msg: 'ok', success: true };
        }
        // this.drink.cookie.setCookie('test_cookie', 'test');
        return { code: 200, data: null, msg: 'id is null', success: false };
        // return this.res.route.url;
    }

    public update =() => {
        return this.drink.plugins.MysqlUtils.select('c_menu').update(['name', 'keepallive'], ['test1', 1], 'id', '1');
    }
}

export default Index;
