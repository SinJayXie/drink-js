export type VariableType = 'number' | 'array' | 'string' | 'record'
export type MethodsType = 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PUT'

interface ParamsRecord {
    type: VariableType,
    desc: string,
    default?: string | null | undefined | number | boolean | Record<any, VariableType>
}

interface DocBody {
    title: string,
    method: MethodsType | string,
    buildTime: number,
    params: Record<any, ParamsRecord>,
    body: Record<any, ParamsRecord>,
    url: string
}

export { DocBody };

class Docs {
    private readonly path: string;
    private method: string;
    private params: Record<any, ParamsRecord>;
    private body: Record<any, ParamsRecord>;
    private title: string;
    constructor(path: string, title?: string ,method?: MethodsType) {
        this.path = path;
        this.method = (method || 'GET').toUpperCase();
        this.title = title || path;
        this.params = {};
        this.body = {};
    }

    public setMethod = (method: MethodsType) => {
        this.method = method.toUpperCase();
        return this;
    }

    public setTitle = (title: string) => {
        this.title = title;
        return this;
    }

    public setParams = (params: Record<any, ParamsRecord>) => {
        this.params = { ...this.params,...params };
        return this;
    }

    public setBody = (body: Record<any, ParamsRecord>) => {
        this.body = { ...this.body,...body };
        return this;
    }

    public generate = (): DocBody => {
        return {
            title: this.title,
            url: this.path,
            method: this.method,
            params: this.params,
            body: this.body,
            buildTime: Date.now()
        };
    }
}

export default Docs;
