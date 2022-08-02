import { MySqlPlugin } from './Extension/MySqlPlugin';
import { AuthPlugin } from './Extension/AuthPlugin';

interface LoaderList {
    MysqlUtils: MySqlPlugin,
    AuthUtils: AuthPlugin
}

const loader: LoaderList = {
    MysqlUtils: new MySqlPlugin(),
    AuthUtils: new AuthPlugin()
};

export {
    loader,
    LoaderList
};
