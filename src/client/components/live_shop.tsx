
import React, { useEffect, useMemo, useState } from 'react';

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
                <h1 className='h3 d-flex mb-0 bg-light p-1 sticky-top'>
                    <img src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.shop.url}&size=32`} />
                    &nbsp;
                    {props.shop.name}
                </h1>
            </Link>

            {/* <pre>{JSON.stringify(props)}</pre> */}

            <ul className='nav nav-pills flex-column'>
                <li className='nav-item p-1'><Link className="nav-link active bg-secondary" to={`/collections?url=${props.shop.url}`}>🗂️ collections ({props.collectionsCount})</Link></li>
                <li className='nav-item p-1'><Link className="nav-link active bg-secondary" to={`/products?url=${props.shop.url}`}>🛍️ products ({props.productsCount})</Link></li>
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
                <h1 className='h3 d-flex mb-0 bg-light p-1 sticky-top'>
                    <img src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.shop.url}&size=32`} />
                    &nbsp;
                    {props.shop.name}
                </h1>
            </Link>

            <h3 className='h4 bg-dark text-light p-2'>🗂️ All collections</h3>

            {/* <pre>{JSON.stringify(props)}</pre> */}

            {! props.collections && (
                <>
                    Loading collections...
                </>
            )}

            {props.collections && (
                <div className='nav nav-pills flex-column'>
                    {props.collections.map((collection: WoocommerceWpJsonCollectionsListCollection) => {
                        return (
                            <div key={collection.slug} className='nav-item p-1'>
                                <Link className="nav-link active bg-secondary" to={`/products?url=${props.shop.url}&collection=${collection.slug}`}>{collection.name} ({collection.count})</Link>
                            </div>
                        );
                    })}
                </div>
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
    const [productsCount, setProductsCount] = useState(props.collection ? props.collection.count : props.shop.productsCount);
    const [collection, setCollection] = useState(props.collection);
    const [loading, setLoading] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const [ per_page, setPerPage ] = useState(12);
    const [ page, setPage ] = useState(1);
    const pagesCount = useMemo(() => Math.ceil(productsCount / per_page), [shop.url, collection])

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

    useEffect(() => {
        setProductsCount(collection ? collection.count : props.shop.productsCount);
    }, [shop.url, collection]);

    return (
        <div className="teleshop-root">
            <Link to={`/shop?url=${props.shop.url}`}>
                <h1 className='h3 d-flex mb-0 bg-light p-1 sticky-top'>
                    <img className='m-1' src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.shop.url}&size=32`} />
                    <div className='m-1'>{props.shop.name}</div>
                </h1>
            </Link>

            {collection && (
                <h3 className='h4 bg-dark text-light p-2'>
                    🗂️ {collection.name} ({productsCount})
                </h3>
            )}

            {! collection && (
                <h3 className='h4 bg-dark text-light p-2'>
                    🛍️ All products ({productsCount})
                </h3>
            )}

            {/* <pre>{JSON.stringify(props)}</pre> */}


            {! products && (
                <>
                    Loading products...
                </>
            )}

            {products && (
                <div className={`list-grid-items ${loading ? "placeholder-wave" : ""}`}>
                    {products.map((product: WoocommerceWpJsonProductsListProduct) => (
                        <div className={`${loading ? "placeholder" : ""}`} key={product.slug}>
                            <Product product={product} setModalContent={setModalContent} />
                        </div>
                    ))}
                </div>
            )}

            <footer className='sticky-bottom bg-light'>
                <div className="d-flex justify-content-around">
                    <input type="hidden" id="page" value="${page}" />

                    <button className={`btn btn-outline-secondary btn-sm btn-page-prev m-1 ${loading ? "disabled" : ""} ${page > 1 ? "" : "disabled"}`} onClick={() => pagePrev()}>
                        ⮜ Prev
                    </button>

                    <div className='m-1'>
                        {loading && <>◌</>}
                        {!loading && <>Page: {page}/{pagesCount}</>}
                    </div>

                    <button className={`btn btn-outline-secondary btn-sm btn-page-next m-1 ${loading ? "disabled" : ""} ${(page < pagesCount || products.length >= per_page) ? "" : "disabled"}`} onClick={() => pageNext()}>
                        Next ➤
                    </button>
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
            <div className="modal-header">
                <div className='d-flex'>
                    <img src={product.images[0]?.src} style={{ width: '120px', height: '120px', margin: '15px' }} />

                    <div className='m-4'>
                        <h2 className='h4'>{product.name}</h2>
                        {product.prices.currency_prefix}{Math.round(Number(product.prices.price))/100}{product.prices.currency_suffix}
                    </div>
                </div>

                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
                <p className='p-3'>
                    {stripTags(product.description)}
                </p>
            </div>
        </>
    );
}