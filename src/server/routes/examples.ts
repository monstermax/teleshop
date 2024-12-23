
import { renderComponent } from '../routes';

import type express from 'express';




export const pageLogin = (req: express.Request, res: express.Response) => {
    // GET /example/login
    res.send('LOGIN');
};


export const pageContact = (req: express.Request, res: express.Response) => {
    // GET /example/contact
    res.send('CONTACT');
};



export const pageExampleReact = (req: express.Request, res: express.Response) => {
    // GET /example/react
    renderComponent(res, 'ExampleReactComponent');
};


export const apiExampleDate = (req: express.Request, res: express.Response) => {
    // GET /example/api/date
    res.json({ now: Date.now() });
};


