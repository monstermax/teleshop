

export type WoocommerceWpJson = {
    name: string,
    description: string,
    url: string,
    home: string,
    gmt_offset: string, // number
    timezone_string: string,
    namespaces: string[],
    authentication: any,
    routes: {[path: string]: any},
    site_logo: number,
    site_icon: number,
    site_icon_url: string,
    _links: {[name: string]: any[]},
    [key: string]: any,
};


export type WoocommerceWpJsonCollectionsListCollection = {

    "id": number,
    "name": string,
    "slug": string,
    "description": string,
    "parent": number,
    "count": number,
    "image": null, // string ? object ?
    "review_count": number,
    "permalink": string,
}

export type WoocommerceWpJsonProductsListProduct = {
    "id": number,
    "name": string,
    "slug": string,
    "parent": number,
    "type": string, // "variable" | ...
    "variation": string,
    "permalink": string,
    "sku": string,
    "short_description": string,
    "description": string,
    "on_sale": boolean,
    "prices": {
        "price": string, // number
        "regular_price": string, // number
        "sale_price": string, // number
        "price_range": null, // any ?
        "currency_code": string,
        "currency_symbol": string,
        "currency_minor_unit": number,
        "currency_decimal_separator": string,
        "currency_thousand_separator": string,
        "currency_prefix": string,
        "currency_suffix": string,
    },
    "price_html": string,
    "average_rating": string, // number
    "review_count": number,
    "images": 
        {
            "id": number,
            "src": string,
            "thumbnail": string,
            "srcset": string,
            "sizes": string,
            "name": string,
            "alt": string,
        }[],
    "categories":
        {
            "id": number,
            "name": string,
            "slug": string,
            "link": string,
        }[],
    "tags": [], // any ?
    "attributes": 
        {
            "id": number,
            "name": string,
            "taxonomy": null, // any ?
            "has_variations": boolean,
            "terms": 
                {
                    "id": number,
                    "name": string,
                    "slug": string,
                }[],
        }[],
    "variations": { "id": number, "attributes": {name: string, value: string}[] }[],
    "has_options": boolean,
    "is_purchasable": boolean,
    "is_in_stock": boolean,
    "is_on_backorder": boolean,
    "low_stock_remaining": null, // number ?
    "sold_individually": boolean,
    "add_to_cart": any,
    "extensions": {}, // any ?
}

