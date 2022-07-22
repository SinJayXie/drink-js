import * as url from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import { DrinkResponse, RouteArgsData } from '../../index';
import DrinkBase from './DrinkBase';
import { createBody } from './Body';

const getRouteArgs = function (route: string): RouteArgsData {
    const urlParse = url.parse(route, true);
    const split = urlParse.pathname.substr(1, route.length).split('/');
    const ret = {
        controller: 'index',
        method: 'index',
        url: urlParse.pathname,
        query: urlParse.query
    };
    if(split.length >= 2) {
        ret.controller = split[0];
        ret.method = split[1];
    }
    return ret;
};

const print_warn = function (msg: string) {
    console.log('\x1B[33m' + msg + '\x1B[39m');
};

const print_error = function (msg: string) {
    console.log('\x1B[31m' + msg + '\x1B[39m');
};

const createHttpResponse = async function (req: IncomingMessage, res: ServerResponse): Promise<DrinkResponse> {
    const route = getRouteArgs(req.url);
    return {
        request: req,
        response: res,
        route,
        drink: new DrinkBase(req, res),
        body: await createBody(req),
        query: route.query
    };
};

const ConversionBuffer = function (data: any): Buffer {
    let ret: Buffer = Buffer.from('');
    switch (typeof data) {
        case 'bigint':
        case 'number':
            ret = Buffer.from(data + '');
            break;
        case 'boolean':
        case 'object':
            ret = Buffer.from(JSON.stringify(data));
            break;
        case 'function':
            ret = Buffer.from('function');
            break;
        case 'symbol':
            ret = Buffer.from(data.toString());
            break;
        case 'string':
            ret = Buffer.from(data);
            break;
        case 'undefined':
            ret = Buffer.from('undefined');
            break;
        default:
            break;
    }
    return ret;
};

const stout = {
    print_error,
    print_warn
};

export {
    getRouteArgs,
    createHttpResponse,
    ConversionBuffer,
    stout
};
