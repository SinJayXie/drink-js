import { IncomingMessage, ServerResponse } from 'http';
import { getRunningEnvironment } from '../lib/Uitls';

interface IPMapObject {
    request_count: number,
    request_ip: string,
    request_time: number
}
const lockTime: number = 1000 * 20;
const lockCount: number = 20;
class FireWallMiddleware {
    private readonly ipMap: Map<string, IPMapObject>;
    constructor() {
        this.ipMap = new Map();
    }
    public app(req: IncomingMessage, res: ServerResponse, next: Function) {
        console.log(`[DrinkJs]->[Firewall]->[${req.method}]->[${req.url}]`);
        if(getRunningEnvironment() === 'prod') {
            next();
            return true;
        }
        const ip = req.socket.remoteAddress;
        if(this.ipMap.has(ip)) {
            const ipConfig = this.ipMap.get(ip);
            if (ipConfig.request_time + lockTime > Date.now()) {
                ipConfig.request_count++;
                if(ipConfig.request_count > lockCount) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(this.ban(ipConfig)));
                    return;
                } else {
                    next();
                }
            } else {
                ipConfig.request_time = Date.now();
                ipConfig.request_count = 1;
                next();
            }
        } else {
            const ipConfig: IPMapObject = {
                request_count: 1,
                request_ip: ip,
                request_time: Date.now()
            };
            this.ipMap.set(ip, ipConfig);
            next();
        }
    }

    public ban(ipConfig: IPMapObject): Record<any, any> {
        return {
            code: 403,
            msg: 'Firewall: request disconnect.',
            expire: ipConfig.request_time + lockTime - Date.now(),
            success: false,
            plugin: 'FireWallMiddleware',
            banIp: ipConfig.request_ip,
            time: Date.now()
        };
    }
}

export {
    FireWallMiddleware
};
