
import fs from 'fs';
import path from 'path';

import { md5 } from './utils.server';

import type { FetchHeaders } from '../types/teleshop';



type CacheMetadata = {
    url: string,
    length: number,
    status: number,
    headers: FetchHeaders,
}


export class FileCache {
    private cacheDir: string;

    constructor(cacheDir: string) {
        this.cacheDir = path.resolve(cacheDir);

        if (! fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir);
        }

    }

    getCacheHostDir(url: string) {
        const urlParsed = new URL(url);
        const domain = urlParsed.hostname;

        if (! domain || domain.includes('../')) {
            throw new Error(`invalid domain "${domain}"`);
        }

        const cacheHostDir = `${this.cacheDir}/${domain}`;
        return cacheHostDir;
    }

    getCachePath(url: string) {
        const cacheHostDir = this.getCacheHostDir(url);

        const urlMd5 = md5(url);
        const cacheFile = `${cacheHostDir}/${urlMd5}`;

        return cacheFile;
    }

    has(url: string, maxAge?: number): boolean {
        const metadataFile = this.getCachePath(url) + '.metadata.json';

        if (! fs.existsSync(metadataFile)) {
            return false;
        }

        if (maxAge) {
            const stat = fs.statSync(metadataFile);

            if (Date.now() - stat.ctime.getTime() > maxAge) {
                return false;
            }
        }

        return true;
    }

    get(url: string): string | null {
        if (! this.has(url)) return null;
        return fs.readFileSync(this.getCachePath(url) + '.content').toString();
    }

    getMetadata(url: string): CacheMetadata | null {
        if (! this.has(url)) return null;
        const json = fs.readFileSync(this.getCachePath(url) + '.metadata.json').toString();
        return JSON.parse(json);
    }

    getObj(url: string): Object | null {
        return JSON.parse(this.get(url) ?? 'null');
    }

    set(url: string, content: string, status: number, headers: FetchHeaders): void {
        const cacheHostDir = this.getCacheHostDir(url);

        if (! fs.existsSync(cacheHostDir)) {
            fs.mkdirSync(cacheHostDir);
        }

        fs.writeFileSync(this.getCachePath(url) + '.content', content);

        const metadata: CacheMetadata = {
            url,
            length: content.length,
            status,
            headers,
        };

        fs.writeFileSync(this.getCachePath(url) + '.metadata.json', JSON.stringify(metadata));
    }

    setMetadata(url: string, content: string): void {
        const cacheHostDir = this.getCacheHostDir(url);

        if (! fs.existsSync(cacheHostDir)) {
            fs.mkdirSync(cacheHostDir);
        }

        fs.writeFileSync(this.getCachePath(url) + '.content', content);

        const metadata = {
            url,
            length: content.length,
        };

        fs.writeFileSync(this.getCachePath(url) + '.metadata.json', JSON.stringify(metadata));
    }

    setObj(url: string, obj: Object, status: number, headers: FetchHeaders): void {
        this.set(url, JSON.stringify(obj), status, headers);
    }
}



