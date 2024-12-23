
import fetch from 'node-fetch';

import { createShop, getShopByUrl, getWoocommerceShopProducts } from '../lib/shop';
import { renderComponent } from '../routes';

import { Shop } from '../types/teleshop';
import { stripUrlTrailingSlash } from '../lib/utils.server';

import type express from 'express';
import { getWoocommerceShopCollectionsCount, getWoocommerceShopProductsCount } from '../lib/woocommerce';


export default async (req: express.Request, res: express.Response) => {
    // GET /shop

    const shopUrl = req.query?.url?.toString();

    if (! shopUrl) {
        res.status(400);
        res.send('Missing shop url');
        return;
    }

    const props = await fetchShopData(shopUrl);

    if (! props.shop) {
        res.status(400);
        res.send('Invalid shop');
        return;
    }

    renderComponent(res, 'LiveShop', 'root', props);
};



export async function fetchShopData(shopUrl: string | null): Promise<{ shop: Shop | null, collectionsCount: number | null, productsCount: number | null, error: string | null }> {
    if (!shopUrl) {
        return { shop: null, collectionsCount: null, productsCount: null, error: "Missing shop URL" };
    }

    const shop = getShopByUrl(shopUrl) || (await createShop(shopUrl));

    if (!shop) {
        return { shop: null, collectionsCount: null, productsCount: null, error: "Invalid shop" };
    }

    if (shop.collectionsCount === null) {
        const collectionsCount = await getWoocommerceShopCollectionsCount(shopUrl);
        shop.collectionsCount = collectionsCount;
    }

    if (shop.productsCount === null) {
        const productsCount = await getWoocommerceShopProductsCount(shopUrl);
        shop.productsCount = productsCount;
    }


    return { shop, collectionsCount: shop.collectionsCount, productsCount: shop.productsCount, error: null };
}

