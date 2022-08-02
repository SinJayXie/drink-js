import Docs from '../lib/DocsApi';
const docLists = [
    new Docs('/Index/getUserById', 'ID获取用户信息','GET').setParams({ id: {
        type: 'string',
        desc: '查询用户信息',
        default: 10000
    },
    id2: {
        type: 'string',
        desc: '查询用户信息',
        default: ''
    } }).generate(),
    new Docs('/Index/getUserByName', 'Name获取用户信息').setParams({
        name: {
            type: 'string',
            desc: '用户名',
            default: ''
        }
    }).generate()
];

export default {
    controller: 'Index',
    name: 'Index控制器模块',
    docLists
};
