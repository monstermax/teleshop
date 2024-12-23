

import { Response } from 'node-fetch';

//import { dirname } from 'path'
//import { fileURLToPath } from 'url'
//const __dirname = dirname(fileURLToPath(import.meta.url))

import { FileCache } from "./FileCache.class.server";

import type { FetchHeaders } from '../types/teleshop';



const cacheDir = `${__dirname}/../../../data/http_cache`;

export const httpCache = new FileCache(cacheDir);


export function getCachedResponse(url: string) {
    let status = 404;
    let content: string = '';
    let headers: FetchHeaders | {} = {};

    if (httpCache.has(url)) {
        const metadata = httpCache.getMetadata(url);

        if (! metadata) {
            throw new Error(`missing metadata`);
        }

        status = metadata.status;
        headers = metadata.headers;

        content = httpCache.get(url) || '';
    }

    return new Response(content, {
        status: status,
        headers: headers,
    });
}

