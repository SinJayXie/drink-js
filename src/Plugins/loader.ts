import { MySqlPlugin } from './Extension/MySqlPlugin';

interface LoaderList {
    MysqlUtils: MySqlPlugin
}

const loader: LoaderList = {
    MysqlUtils: new MySqlPlugin()
};

export {
    loader,
    LoaderList
};
