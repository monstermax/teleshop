
import fs from 'fs';

import type express from 'express';

import { pageContact } from './routes/examples';



function loadModule(modulePath: string, method='default') {
    return import(modulePath).then(module => module[method]);
}


export function renderComponent(res: express.Response, componentName: string, containerId='root', props?:{[key: string]: any}) {
    let content = fs.readFileSync(`${__dirname}/index.html`).toString();

    const propsJs = JSON.stringify(props ?? '{}');

    const scripts = [
        `<script>loadComponent(document.getElementById("${containerId}"), window.components["${componentName}"], ${propsJs})</script>`,
    ];

    content = content.replace('<!-- scripts placeholder -->', scripts.join('\n\t'));

    res.send(content);
}


export const routes = async function (app: express.Express) {

    // homepage
    app.get('/', await loadModule('./routes/home'));

    // some page
    app.get('/example/login', await loadModule('./routes/examples', 'pageLogin'));

    // other page
    //app.get('/contact', await loadModule('./routes/pages', 'pageContact')); // or, alternative way below
    app.get('/example/contact', pageContact);

    // react example
    app.get('/example/react', await loadModule('./routes/examples', 'pageExampleReact'));

    // api example
    app.get('/example/api/date', await loadModule('./routes/examples', 'apiExampleDate'));

    // custom routes
    app.get('/shop', await loadModule('./routes/shop'));
    app.get('/collections', await loadModule('./routes/collections'));

    app.get('/products', await loadModule('./routes/products'));
    app.get('/api/products', await loadModule('./routes/products', 'apiProducts'));
}

