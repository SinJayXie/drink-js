import * as path from 'path';
import * as Utils from './Uitls';
import DrinkBase from './DrinkBase';
import { RouteArgsData } from '../../index';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { gzip } from 'zlib';

class TemplateEjs {
    private route: RouteArgsData;
    private drink: DrinkBase;
    private record: Record<string, any>;
    private templateBasePath: string;
    constructor(route: RouteArgsData, drink: DrinkBase) {
        this.route = route;
        this.drink = drink;
        this.record = {};
        this.templateBasePath = this.drink.env === 'prod' ? path.join(__dirname, '..', 'templates') : path.join(__dirname, '../../src', 'templates');

    }

    public setRecord = (record?: Record<string, any>) => {
        this.record = record || {};
        return this;
    }

    public render = (templatePath?: string): Promise<Buffer> | string => {
        const requestTemplate = templatePath ? path.join(this.templateBasePath ,templatePath + '.ejs') : path.join(this.templateBasePath ,this.route.controller, this.route.method + '.ejs');
        if(fs.existsSync(requestTemplate)) {
            const templateBuffer = fs.readFileSync(requestTemplate);
            this.drink.setHeader('Content-Type', 'text/html; charset=utf-8');
            const retBuf = ejs.render(templateBuffer.toString(), this.record, {
                async: false,
                beautify: false,
                debug: false
            });
            if(this.checkGzip()) {
                return new Promise((resolve) => {
                    gzip(retBuf,(err, buffer) => {
                        if(err) {
                            throw Error(err.message);
                        } else {
                            this.drink.setHeader('Content-Encoding', 'gzip');
                            resolve(buffer);
                        }
                    });
                });
            }
            return retBuf;
        } else {
            throw Error('Template -> ' + requestTemplate + ' not found.');
        }
    }

    public checkGzip = (): boolean => {
        const accept_encoding = this.drink.getHeader('accept-encoding') || '';
        return accept_encoding.indexOf('gzip') !== -1;
    }
}

export { TemplateEjs };
