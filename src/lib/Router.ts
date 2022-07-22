import { IncomingMessage, ServerResponse } from 'http';
import controllers from './Controller';
import * as DrinkJs from './DrinkJs';
import * as utils from './Uitls';
import { ConversionBuffer } from './Uitls';
class Router {
    private readonly routers: Map<any, any>;

    constructor() {
        this.routers = new Map();
        this.initRouter(controllers);
    }

    public initRouter(controllers: Map<any, any>) {
        controllers.forEach((controller, path) => {
            if (new controller.default() instanceof DrinkJs.Controller) {
                this.routers.set(path, controller.default);
            }
        });
    }

    public async match(req: IncomingMessage, res: ServerResponse) {
        try {
            const newResponse = await utils.createHttpResponse(req, res);
            if (this.routers.has(newResponse.route.controller)) {
                const controller = this.routers.get(newResponse.route.controller);
                if(new controller() instanceof DrinkJs.Controller) {
                    const methodList = new controller(newResponse);
                    const cb = methodList[newResponse.route.method];
                    if(typeof cb === 'function') {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        const buffer = ConversionBuffer(await cb());
                        res.end(buffer);
                        return true;
                    }
                    res.end(utils.ConversionBuffer({
                        code: 404,
                        msg: '404 not found',
                        success: false,
                        time: Date.now()
                    }));
                }
                return true;
            }
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(utils.ConversionBuffer({
                code: 404,
                msg: '404 not found',
                success: false,
                time: Date.now()
            }));
        } catch (e) {
            utils.stout.print_error(e.stack);
            res.statusCode = 500;
            res.end(e.stack);
        }

    }
}

export default Router;
