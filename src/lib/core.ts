import * as http from 'http';
import Router from './Router';
import { DrinkJsConfig } from '../../index';
const router = new Router();
import middlewares from '../Middleware/Loader';
const createServer = function (config: DrinkJsConfig) {
    const app = http.createServer(async (req, res) => {
        if(Array.isArray(middlewares)) {
            if(middlewares.length > 0) {
                try {
                    for (let index = 0; index < middlewares.length; index++) {
                        if(index === middlewares.length - 1) {
                            const isNext = await new Promise((resolve) => {
                                const time: any = timeout(resolve);
                                middlewares[index].app(req, res, next(resolve,time));
                            });
                            if(isNext) {
                                await router.match(req, res);
                            } else {
                                index = middlewares.length;
                            }
                        } else {
                            const isNext = await new Promise((resolve) => {
                                const time: any = timeout(resolve);
                                middlewares[index].app(req, res, next(resolve,time));
                            });
                            if(!isNext) index = middlewares.length;
                        }
                    }

                } catch (e) {
                    res.statusCode = 500;
                    res.end(e.stack);
                }

            } else {
                await router.match(req, res);
            }
        } else {
            await router.match(req, res);
        }
    });
    app.listen(config.port, config.host, 0, config.listenCallback);
};

function timeout(fn: Function) {
    return setTimeout(() => {fn(false);}, 1000 * 15);
}

function next(fn: Function, time: number) {
    return () => {
        clearTimeout(time);
        fn(true);
    };
}

export {
    createServer
};
