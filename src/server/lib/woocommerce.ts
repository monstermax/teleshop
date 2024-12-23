
import { stripUrlTrailingSlash } from "./utils.server";



export async function getWoocommerceShopCollectionsCount(shopUrl: string) {
    const wpJsonCollectionsUrl = `${stripUrlTrailingSlash(shopUrl)}/wp-json/wc/store/v1/products/categories?per_page=1`;
    const collectionsResponse = await fetch(wpJsonCollectionsUrl);
    const collectionsCount = Number(collectionsResponse.headers.get('x-wp-total')) || -1;
    return collectionsCount;
}


export async function getWoocommerceShopProductsCount(shopUrl: string) {
    const wpJsonProductsUrl = `${stripUrlTrailingSlash(shopUrl)}/wp-json/wc/store/v1/products?per_page=1`;
    const productsResponse = await fetch(wpJsonProductsUrl);
    const productsCount = Number(productsResponse.headers.get('x-wp-total')) || -1;
    return productsCount;
}
