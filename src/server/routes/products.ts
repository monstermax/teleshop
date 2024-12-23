
import { renderComponent } from '../routes';

import { getWoocommerceShopCollections, getWoocommerceShopProducts } from '../lib/shop';
import { fetchShopData } from './shop';

import type express from 'express';
import type { WoocommerceWpJsonCollectionsListCollection, WoocommerceWpJsonProductsListProduct } from '../types/woocommerce';
import { Shop } from '../types/teleshop';



export default async (req: express.Request, res: express.Response) => {
    // GET /products

    const shopUrl = req.query?.url?.toString();
    const collectionSlug = req.query?.collection?.toString();

    if (! shopUrl) {
        res.status(400);
        res.send('Bad request');
        return;
    }

    const props = await fetchShopProductsData(shopUrl, collectionSlug);

    if (! props.shop) {
        res.status(400);
        res.send('Invalid shop');
        return;
    }

    renderComponent(res, 'LiveShopProducts', 'root', props);
};


export const apiProducts = async (req: express.Request, res: express.Response) => {
    // GET /api/products

    const shopUrl = req.query?.url?.toString();
    const collectionSlug = req.query?.collection?.toString();
    const page = Number(req.query?.page) || 1;

    if (! shopUrl) {
        res.status(400);
        res.send({ error: 'Missing shop url' });
        return;
    }

    const props = await fetchShopProductsData(shopUrl, collectionSlug, page, 15);

    if (! props.shop) {
        res.status(400);
        res.send({ error: 'Invalid shop' });
        return;
    }

    res.json(props);
};


async function fetchShopProductsData(shopUrl: string | null, collectionSlug?: string, page=1, limit=10): Promise<{ shop: Shop | null, collection: WoocommerceWpJsonCollectionsListCollection | null, products: WoocommerceWpJsonProductsListProduct[] | null, error: string | null }> {
    if (!shopUrl) {
        return { shop: null, collection: null, products: null, error: "Missing shop URL" };
    }

    const { shop, error } = await fetchShopData(shopUrl);

    if (error) {
        return { shop: null, collection: null, products: null, error };
    }

    let collection: WoocommerceWpJsonCollectionsListCollection | null = null;

    if (collectionSlug) {
        const collections = await getWoocommerceShopCollections(shopUrl, { limit: 100, page: 1 });
        collection = collections.find(collection => collection.slug === collectionSlug) ?? null;
    }


    const products = await getWoocommerceShopProducts(shopUrl, {
        limit,
        page,
        collectionId: collection?.id,
    });

    return { shop, collection, products, error: null };
}

