import { IncomingMessage, ServerResponse } from 'http';
import DrinkBase from './src/lib/DrinkBase';
import { PoolConfig } from 'mysql';

interface DrinkJsConfig {
    port: number,
    host: string,
    listenCallback: () => void,
    mysqlConfig: PoolConfig
}

interface RouteArgsData {
    controller: string,
    method: string,
    query: Record<any, any>,
    url: string
}

interface DrinkResponse {
    route: RouteArgsData,
    request: IncomingMessage,
    response: ServerResponse,
    drink: DrinkBase,
    body: Record<any, any>,
    query: Record<any, any>,
}

interface CookieConfig {
    Path?: string,
    Expires?: Date,
    HttpOnly?: boolean,
    Domain?: string,
    SameSite?: string,
    MaxAge?: number
}
