import * as path from 'path';
const MimeTypes: Record<string, string> = {
    'html': 'text/html; charset=utf-8',
    'txt': 'text/txt; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'jpg': 'image/jpg',
    'jpge': 'image/jpge',
    'webp': 'image/webp',
    'svg': 'image/svg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mp3': 'audio/mp3',
    'flac': 'audio/flac',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'avi': 'video/avi',
    'rmvb': 'video/rmvb',
    'm3u8': 'video/m3u8',
    'mvk': 'video/mvk'
};

class MimeType {
    private readonly types: Record<string, string>;
    constructor() {
        this.types = MimeTypes;
    }

    public getType = (ext: string): string => {
        return this.types[ext.toLowerCase()] || 'application/octet-stream';
    }

    public add = (ext: string, contentType: string) => {
        this.types[ext.toLowerCase()] = contentType;
    }

    public getFileType = (file: string) => {
        const extname = path.extname(file).toLowerCase().replace('.','');
        return this.types[extname] || 'application/octet-stream';
    }
}

export {
    MimeType,
    MimeTypes
};
