
import fetch from 'node-fetch';
import { load } from 'cheerio';

import { fetchHtml, fetchJson, stripUrlTrailingSlash } from './utils.server';

import type { Shop, ShopType } from "../types/teleshop";
import type { WoocommerceWpJson, WoocommerceWpJsonCollectionsListCollection, WoocommerceWpJsonProductsListProduct } from "../types/woocommerce";




export const shops: {[shopUrl: string]: Shop} = {};


export function getShopByUrl(shopUrl: string): Shop | null {
    const domain = getUrlDomain(shopUrl);
    return getShopByDomain(domain);
}

export function getUrlDomain(url: string): string {
    const urlParsed = new URL(url);
    const domain = urlParsed.hostname;
    return domain;
}

export function getShopByDomain(domain: string): Shop | null {
    return shops[domain] ?? null;
}

export async function createShop(shopUrl: string): Promise<Shop | null> {
    console.log(`createShop ${shopUrl}`);
    //await sleep(1000);

    const domain = getUrlDomain(shopUrl);
    if (! domain) throw new Error(`invalid domain`);

    const existingShop = getShopByUrl(shopUrl);
    //if (existingShop) throw new Error(`Shop already exists`);
    if (existingShop) return existingShop;

    const shopType = await detectShopType(shopUrl);

    if (! shopType) {
        return null;
    }

    let shopName = '';

    if (shopType === 'woocommerce') {
        shopName = await getWoocommerceShopName(shopUrl) ?? '';

    } else {
        shopName = await getPageTitle(shopUrl) ?? '';
    }

    const shop: Shop = {
        name: shopName,
        url: shopUrl,
        type: shopType,
        collectionsCount: null,
        productsCount: null,
    }

    shops[domain] = shop;

    return shop;
}

export async function detectShopType(shopUrl: string): Promise<ShopType | null> {
    console.log(`detectShopType ${shopUrl}`);
    //await sleep(1000);

    const typesUrls: {[shopType: string]: string} = {
        //shopify: `${url}/products.json?limit=1`,
        //woocommerce: `${url}/wp-json/wc/store/v1/products?per_page=1`,
        woocommerce: `${shopUrl}/wp-json`,
    };

    const timeout = 15_000;
    const promises: Promise<[string, boolean]>[] = [];

    for (const shopType in typesUrls) {
        const url = typesUrls[shopType];

        const promise: Promise<[string, boolean]> = fetch(url, { method: 'HEAD', timeout })
            .then((response) => {
                return [shopType, response.status === 200] as [string, boolean];
            })
            .catch((err: any) => {
                console.warn(`ERROR detectShopType. ${err.message}`);
                return [shopType, false] as [string, boolean];
            })

        promises.push(promise);
    }

    const results = await Promise.all(promises);
    const result = results.find(result => result[1]);
    const shopType = result ? result[0] : null;

    return shopType as ShopType;
}


export async function getPageTitle(url: string): Promise<string | null> {
    console.log(`getPageTitle ${url}`);
    //await sleep(1000);

    const timeout = 15_000;

    return fetchHtml(url, { timeout }, true)
        .then(content => {
            if (! content) throw new Error(`empty html`);
            return content;
        })
        .then(content => {
            const $ = load(content);
            const title = $('title').text() as string;
            const shopName = title.split('|')[0].trim();
            return shopName;
        })
        .catch((err: any) => {
            console.warn(`ERROR getPageTitle. ${err.message}`);
            return null;
        })
}

export async function getWoocommerceShopName(shopUrl: string) {
    console.log(`getWoocommerceShopName ${shopUrl}`);
    //await sleep(1000);

    const wpJsonUrl = `${stripUrlTrailingSlash(shopUrl)}/wp-json`;
    const timeout = 15_000;

    return fetchJson(wpJsonUrl, { timeout }, true)
        .then(obj => {
            if (! obj) throw new Error(`empty object`);
            return obj;
        })
        .then((shopInfos: WoocommerceWpJson) => {
            return shopInfos.name;
        })
        .catch((err: any) => {
            console.warn(`ERROR getWoocommerceShopName. ${err.message}`);
            return null;
        })
}


export async function getWoocommerceShopCollections(shopUrl: string, options?: { limit?: number, page?: number }): Promise<WoocommerceWpJsonCollectionsListCollection[]> {
    console.log(`getWoocommerceShopCollections ${shopUrl}`);
    //await sleep(1000);

    const wpJsonUrl = `${stripUrlTrailingSlash(shopUrl)}/wp-json/wc/store/v1/products/categories?per_page=${options?.limit || 10}&page=${options?.page || 1}`;
    const timeout = 15_000;

    return fetchJson(wpJsonUrl, { timeout }, true)
        .then(obj => {
            if (! obj) throw new Error(`empty object`);
            return obj;
        })
        .catch((err: any) => {
            console.warn(`ERROR getWoocommerceShopCollections. ${err.message}`);
            return null;
        })

}


export async function getWoocommerceShopProducts(shopUrl: string, options?: { limit?: number, page?: number, collectionSlug?: string, collectionId?: number }): Promise<WoocommerceWpJsonProductsListProduct[]> {
    console.log(`getWoocommerceShopProducts ${shopUrl}`, options?.collectionId, options?.collectionSlug);
    //await sleep(1000);

    const timeout = 15_000;
    let wpJsonUrl = `${stripUrlTrailingSlash(shopUrl)}/wp-json/wc/store/v1/products?per_page=${options?.limit || 10}&page=${options?.page || 1}`;

    if (options?.collectionId) {
        wpJsonUrl += `&category=${options.collectionId}`;

    } else if (options?.collectionSlug) {
        const collections = await getWoocommerceShopCollections(shopUrl, { limit: 100, page: 1 });
        const collection = collections.find(collection => collection.slug === options.collectionSlug);

        wpJsonUrl += `&category=${collection?.id || 0}`;
    }


    return fetchJson(wpJsonUrl, { timeout }, true)
        .then(obj => {
            if (! obj) throw new Error(`empty object`);
            return obj;
        })
        .catch((err: any) => {
            console.warn(`ERROR getWoocommerceShopProducts. ${err.message}`);
            return null;
        })

}



export async function fetchShopCollectionsData(shopUrl: string | null) {
    if (!shopUrl) {
        return { shop: null, collections: null, error: "Missing shop URL" };
    }

    const shop = getShopByUrl(shopUrl) || (await createShop(shopUrl));

    if (!shop) {
        return { shop: null, collections: null, error: "Shop not found" };
    }

    const collections = await getWoocommerceShopCollections(shopUrl, {
        limit: 12,
        page: 1,
    });

    return { shop, collections, error: null };
}


export async function fetchShopProductsData(shopUrl: string | null, collectionSlug?: string) {
    if (!shopUrl) {
        return { shop: null, collections: null, error: "Missing shop URL" };
    }

    const shop = getShopByUrl(shopUrl) || (await createShop(shopUrl));

    if (!shop) {
        return { shop: null, collections: null, error: "Shop not found" };
    }

    let collection: WoocommerceWpJsonCollectionsListCollection | null = null;

    if (collectionSlug) {
        const collections = await getWoocommerceShopCollections(shopUrl, { limit: 100, page: 1 });
        collection = collections.find(collection => collection.slug === collectionSlug) ?? null;
    }


    const products = await getWoocommerceShopProducts(shopUrl, {
        limit: 12,
        page: 1,
        collectionId: collection?.id,
    });

    return { shop, collection, products, error: null };
}

