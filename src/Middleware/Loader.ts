import { StaticMiddleware } from './StaticMiddleware';
import { FireWallMiddleware } from './FireWallMiddleware';
import { DocsMiddleware } from './DocsMiddleware';
import { SessionConfig, SessionMiddleware } from './SessionMiddleware';

const session_config: SessionConfig = {
    key: 'drink'
};

const middlewares = [
    new FireWallMiddleware(),
    new StaticMiddleware(),
    new DocsMiddleware(),
    new SessionMiddleware(session_config)
];
export default middlewares;
