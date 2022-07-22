import * as path from 'path';
import * as fs from 'fs';

const controllerDir = path.join(__dirname, '../controllers');

const controllers = new Map();

fs.readdirSync(controllerDir).forEach((name) => {
    if(path.extname(name) === '.js') {
        try {
            // eslint-disable-next-line global-require
            controllers.set(path.basename(name, '.js'), require(path.join(controllerDir, name)));
        } catch (e) {
            print_error(e.stack);
        }
    }
    return undefined;

});

function print_error(msg: string) {
    console.log('\x1B[31m' + msg + '\x1B[39m');
}

export default controllers;

