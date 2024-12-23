

import React from 'react';
import ReactDOM from 'react-dom/client';

import * as components from './components';


declare global {
    interface Window {
      components: typeof components;
      loadComponent: typeof loadComponent;
    }
}


const loadComponent = ($el: HTMLElement, AppComponent: (props: any) => React.JSX.Element, props?: any) => {
    const root = ReactDOM.createRoot($el);

    root.render(
        <React.StrictMode>
            <AppComponent {...props} />
        </React.StrictMode>
    );
}


// EXPOSE "components" TO "window"
window.components = components;

// EXPOSE "loadComponent" TO "window"
window.loadComponent = loadComponent;

