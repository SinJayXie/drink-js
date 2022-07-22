import { DrinkJsConfig } from '../index';

const config: DrinkJsConfig = {
    port: 4000,
    host: '0.0.0.0',
    listenCallback: function () {
        console.log('The Drink Server Listening http://0.0.0.0:4000');
    },
    mysqlConfig: {
        host: 'localhost',
        user: 'root',
        password: 'dishuyl',
        database: 'lottery'
    }
};

export default config;
