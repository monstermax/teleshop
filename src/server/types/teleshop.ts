
import type { Headers } from 'node-fetch';


export type Shop = {
    name: string,
    url: string,
    type: null | ShopType,
    collectionsCount: number | null,
    productsCount: number | null,
};


export type ShopType = 'shopify' | 'woocommerce';


//export type FetchHeaders = {[key: string]: string};
export type FetchHeaders = Headers;

