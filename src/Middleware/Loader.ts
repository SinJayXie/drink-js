import { StaticMiddleware } from './StaticMiddleware';
import { TestMiddleware } from './TestMiddleware';
const middlewares = [
    new StaticMiddleware(),
    new TestMiddleware()
];
export default middlewares;
