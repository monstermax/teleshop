

import type express from 'express';


export default (req: express.Request, res: express.Response) => {
    // GET /               <=== for information only. no annotation or other magic...

    const url = req.query.url?.toString() || '';

    const html = `<h1>HOMEPAGE</h1> <a href="/shop?url=${encodeURIComponent(url)}" class="btn btn-notice p-5">Start</a>`;

    res.send(html);
};

