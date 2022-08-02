import * as DrinkJs from '../lib/DrinkJs';
import { DrinkResponse } from '../../index';
import { get } from 'https';

class Index extends DrinkJs.Controller {
    private readonly res: DrinkResponse;
    constructor(res: DrinkResponse) {
        super(res);
        this.res = res;
    }

    public getUserById = async () => {
        console.log(this.drink.plugins.AuthUtils.isAuth(this.drink));
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

    public getUserByName = () => {
        const { name } = this.drink.getParams(['name']);
        return this.drink.success({
            name
        });
    }

    public render = () => {
        return this.drink.template.setRecord().render();
    }

    public getOil = () => {
        this.drink.setHeader('Content-Type', 'text/html');
        return new Promise((resolve) => {
            get({
                hostname: 'weixin.bei-lin.cn',
                method:'GET',
                path: '/af460660-ba55-11eb-893c-596190706d72/site/detail?site_id=7e5d3620-56b3-11eb-a434-27dcd3191748',
                headers: {
                    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.26(0x18001a28) NetType/4G Language/zh_CN'
                }
            }, (response) => {
                const chunk_: Buffer[] = [];
                response.on('data', (chunk: Buffer) => {
                    chunk_.push(chunk);
                });
                response.on('end', () => {
                    resolve(Buffer.concat(chunk_));
                });
            });
        });
    }
}

export default Index;
