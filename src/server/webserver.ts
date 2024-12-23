
import path from 'path';
import express from 'express';

import { routes } from './routes';


type WebserverOptions = {
    httpPort?: number,
    staticDir?: string,
}


export async function startWebserver({httpPort, staticDir}: WebserverOptions={}) {
    httpPort = httpPort || Number(process.env.PORT) || 3111;
    staticDir = staticDir || path.join(__dirname, '../../public');

    // INIT SERVER
    const app = express();

    // ATTACH PUBLIC DIR
    app.use(express.static(staticDir));

    // ATTACH OUR ROUTES
    routes(app);


    // LISTEN TCP HTTP
    app.listen(httpPort, () => {
        console.log(`Listening on http://0.0.0.0:${httpPort}`);
    });


    if (process.argv.includes('--dev')) {
        // CLIENT HOT RELOAD
        import('./webpack_watcher');
    }

};


