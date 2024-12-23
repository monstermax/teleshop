
import { renderComponent } from '../routes';

import { getWoocommerceShopCollections } from '../lib/shop';
import { fetchShopData } from './shop';

import type express from 'express';
import type { WoocommerceWpJsonCollectionsListCollection } from '../types/woocommerce';
import { Shop } from '../types/teleshop';



export default async (req: express.Request, res: express.Response) => {
    // GET /collections

    const shopUrl = req.query?.url?.toString();
    const page = Number(req.query?.page) || 1;

    if (! shopUrl) {
        res.status(400);
        res.send({ error: 'Missing shop url' });
        return;
    }

    const props = await fetchShopCollectionsData(shopUrl, page);

    if (! props.shop) {
        res.status(400);
        res.send({ error: 'Invalid shop' });
        return;
    }

    renderComponent(res, 'LiveShopCollections', 'root', props);
};


async function fetchShopCollectionsData(shopUrl: string | null, page=1, limit=12): Promise<{ shop: Shop | null, collections: WoocommerceWpJsonCollectionsListCollection[] | null, error: string | null }> {
    if (!shopUrl) {
        return { shop: null, collections: null, error: "Missing shop URL" };
    }

    const { shop, error } = await fetchShopData(shopUrl);

    if (error) {
        return { shop: null, collections: null, error };
    }

    const collections = await getWoocommerceShopCollections(shopUrl, {
        limit,
        page,
    });

    return { shop, collections, error: null };
}

