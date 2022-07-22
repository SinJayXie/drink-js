import { PluginBase } from '../PluginBase';
import * as mysql from 'mysql';
import config from '../../Config';
class MySqlPlugin extends PluginBase {
    private pool: mysql.Pool;
    private table: string;
    constructor() {
        super();
        if(config.mysqlConfig) {
            this.pool = mysql.createPool(config.mysqlConfig);
        }
        this.table = '';
    }
    public query = (sql: string, query?: any[]): Promise<any[] | Record<any, any> | unknown> => {
        this.table = '';
        console.log('[MySql Plugin]: Query: ' + sql);
        return new Promise((resolve,reject) => {
            this.pool.query(sql, query, function (err, results, fields) {
                if(err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    public select = (table: string) => {
        this.table = table;
        return new SelectUtils(this.table, this.query);
    }

}

function filterFields(fields: string []){
    if(Array.isArray(fields)) {
        return fields.join(',');
    } else {
        return '*';
    }
}

class SelectUtils {
    private readonly query: (sql: string, query?: any[] | string | number) => Promise<any[] | Record<any, any> | unknown>;
    private readonly table: string;
    private sql: string;
    private field: string[];
    constructor(table: string,cb: (sql: string, query?: any[]) => Promise<any[] | Record<any, any> | unknown>) {
        this.query = cb;
        this.table = table;
        this.sql = '';
        this.field = [];
    }

    public fields = (field: string[]) => {
        this.field = field;
        return {
            where: this.where,
            rows: this.rows,
            update: this.update
        };
    }

    public where = (field: string[] | string, value?: any[]| string | number) => {
        const makeField: string[] = [];
        if(Array.isArray(field)) {
            field.forEach((name, index) => {
                makeField.push('`' + name +'` = ?');
            });
            if(this.table !== '') return this.query(`SELECT ${filterFields(this.field)} FROM ${this.table} WHERE ${makeField.join(' AND ')}`, value);
            throw Error('MySql: No select table please select(table).');
        }
        if(this.table !== '') return this.query(`SELECT ${filterFields(this.field)} FROM ${this.table} WHERE ${field} = ?`, value);
        throw Error('MySql: No select table please select(table).');
    }

    /**
     * Show tables list
     */
    public rows = (limit?: number) => {
        if(this.table !== '') return this.query(`SELECT ${filterFields(this.field)} FROM ${this.table} ${limit > 0 ? `limit ${limit}` : ''}`);
        throw Error('MySql: No select table please select(table).');
    }

    public update = (field: string[] | string, value?: any[]| string | number, whereField?: string, whereValue?: string | number) => {
        const makeField: string[] = [];
        if(Array.isArray(field)) {
            field.forEach((name, index) => {
                makeField.push('`' + name +'` = ?');
            });
            if(this.table !== '') return this.query(`UPDATE ${this.table} SET ${makeField.join(',')} WHERE ${whereField} = '${whereValue}'`, value);
            throw Error('MySql: No select table please select(table).');
        }
        if(this.table !== '') return this.query(`UPDATE ${this.table} SET ${field} = ? WHERE ${whereField} = '${whereValue}'`, value);
        throw Error('MySql: No select table please select(table).');
    }
}

export { MySqlPlugin };
