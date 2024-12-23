
import crypto from 'crypto';
import fetch, { RequestInit, Response } from 'node-fetch';

import { getCachedResponse, httpCache } from './http_cache.server';



export async function fetchCached(url: string, init?: RequestInit) {
    if (httpCache.has(url)) {
        return getCachedResponse(url);
    }

    const response = await fetch(url, init);

    const content = await response.text();

    httpCache.set(url, content, response.status, response.headers);

    const cachedResponse = new Response(content, {
        status: response.status,
        headers: response.headers,
    });

    return cachedResponse;
}


export async function fetchJson(url: string, init?: RequestInit, useCache=false) {
    //console.log('products fetch start', init, useCache)
    const response = useCache ? await fetchCached(url) : await fetch(url, init);
    //console.log('products fetch end')

    if (response.status !== 200) {
        throw new Error(`http status ${response.status}`);
    }

    return await response.json();
}


export async function fetchHtml(url: string, init?: RequestInit, useCache=false) {
    const response = useCache ? await fetchCached(url) : await fetch(url, init);

    if (response.status !== 200) {
        throw new Error(`http status ${response.status}`);
    }

    return await response.text();
}


export function md5(str: string): string {
    return crypto.createHash('md5').update(str).digest("hex");
}


export function stripUrlTrailingSlash(url: string) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

