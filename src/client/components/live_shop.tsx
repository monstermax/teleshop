
import React, { useEffect, useState } from 'react';

import { Link } from './elements/Link';
import { fetchJson, stripTags } from '../lib/utils.client';

import type { WoocommerceWpJsonCollectionsListCollection, WoocommerceWpJsonProductsListProduct } from '../../server/types/woocommerce';


// @ts-ignore
const bootstrap = window.bootstrap;


export const LiveShop = (props: any) => {
    if (! props.shop) {
        return (
            <>
                Error: missing shop
            </>
        );
    }

    return (
        <div className="teleshop-root">
            <Link to={`/shop?url=${props.shop.url}`}>
                <h1>
                    <img src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.shop.url}&size=32`} />
                    &nbsp;
                    {props.shop.name}
                </h1>
            </Link>

            {/* <pre>{JSON.stringify(props)}</pre> */}

            <ul>
                <li><Link to={`/collections?url=${props.shop.url}`}>collections</Link> ({props.collectionsCount})</li>
                <li><Link to={`/products?url=${props.shop.url}`}>products</Link> ({props.productsCount})</li>
            </ul>
        </div>
    );
}


export const LiveShopCollections = (props: any) => {
    if (! props.shop) {
        return (
            <>
                Error: missing shop
            </>
        );
    }

    return (
        <div className="teleshop-root">
            <Link to={`/shop?url=${props.shop.url}`}>
                <h1>
                    <img src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.shop.url}&size=32`} />
                    &nbsp;
                    {props.shop.name}
                </h1>
            </Link>

            <h3>collections</h3>

            {/* <pre>{JSON.stringify(props)}</pre> */}

            {! props.collections && (
                <>
                    Loading collections...
                </>
            )}

            {props.collections && (
                <ul>
                    {props.collections.map((collection: WoocommerceWpJsonCollectionsListCollection) => {
                        return (
                            <li key={collection.slug}>
                                <Link to={`/products?url=${props.shop.url}&collection=${collection.slug}`}>{collection.name} ({collection.count})</Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}


export const LiveShopProducts = (props: any) => {
    if (! props.shop) {
        return (
            <>
                Error: missing shop
            </>
        );
    }

    const [shop, setShop] = useState(props.shop);
    const [products, setProducts] = useState(props.products);
    const [collection, setCollection] = useState(props.collection);
    const [loading, setLoading] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const [ per_page, setPerPage ] = useState(12);
    const [ page, setPage ] = useState(1);

    const pagePrev = () => setPage(page-1);
    const pageNext = () => setPage(page+1);

    useEffect(() => {
        setLoading(true);

        fetchJson(`/api/products?url=${shop.url}&collection=${collection?.slug || ''}&page=${page}`)
            .then(result => {
                if (products !== result.data.products) {
                    setProducts(result.data.products);
                }

                setLoading(false);
            });
    }, [shop.url, collection, page])

    return (
        <div className="teleshop-root">
            <Link to={`/shop?url=${props.shop.url}`}>
                <h1>
                    <img src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.shop.url}&size=32`} />
                    &nbsp;
                    {props.shop.name}
                </h1>
            </Link>

            {collection && (
                <h3>
                    {collection.name}
                </h3>
            )}

            {! collection && (
                <h3>
                    All products
                </h3>
            )}

            {/* <pre>{JSON.stringify(props)}</pre> */}


            {! products && (
                <>
                    Loading products...
                </>
            )}

            {products && (
                <div className="list-grid-items">
                    {products.map((product: WoocommerceWpJsonProductsListProduct) => (
                        <Product key={product.slug} product={product} setModalContent={setModalContent} />
                    ))}
                </div>
            )}

            <footer>
                <div className="d-flex justify-content-around">
                    <input type="hidden" id="page" value="${page}" />
                    <button className={`btn btn-secondary btn-sm btn-page-prev ${loading ? "disabled" : ""} ${page > 1 ? "" : "disabled"}`} onClick={() => pagePrev()}>Prev</button>
                    <button className={`btn btn-secondary btn-sm btn-page-next ${loading ? "disabled" : ""} ${products.length >= per_page ? "" : "disabled"}`} onClick={() => pageNext()}>Next</button>
                </div>
            </footer>

            <div id="modal-products" className='modal'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        {modalContent}
                    </div>
                </div>
            </div>
        </div>
    );
}


function Product(props: any) {
    const product: WoocommerceWpJsonProductsListProduct = props.product;
    const setModalContent = props.setModalContent;

    const productClick = () => {
        setModalContent(<ProductModalContent product={product} />);

        const modalProducts = new bootstrap.Modal(document.getElementById('modal-products'), {})
        modalProducts.show();
    }

    return (
        <div className="list-grid-item" data-product-id={product.id}>
            <div className='pointer' onClick={() => productClick()}>
                <img src={product.images[0]?.src} style={{ width: '90px', height: '90px' }} />
            </div>
            <div className="truncate bold pointer" onClick={() => productClick()}>
                {product.name}
            </div>
            {/*
            <div>
                <button className="btn btn-warning btn-sm btn-add-cart" onClick={() => productClick()}>{product.prices.currency_prefix}{Math.round(Number(product.prices.price))/100}{product.prices.currency_suffix}</button>
            </div>
            */}
        </div>
    );
}



function ProductModalContent(props: any) {
    const product: WoocommerceWpJsonProductsListProduct = props.product;

    return (
        <>
            <div className='d-flex'>
                <img src={product.images[0]?.src} style={{ width: '74px', height: '74px', margin: '15px' }} />
                <div className='m-4'>
                    <h2 className='h4'>{product.name}</h2>
                    {product.prices.currency_prefix}{Math.round(Number(product.prices.price))/100}{product.prices.currency_suffix}
                </div>
            </div>

            <p className='p-3'>
                {stripTags(product.description)}
            </p>
        </>
    );
}