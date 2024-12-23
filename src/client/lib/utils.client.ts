
import { useEffect, useState } from 'react';


type fetchDataOptions = {
    signal?: AbortSignal,
};

type FetchResponse = {
    data: any,
    status: number,
    headers: {[key: string]: string},
}


export async function sleep(duration: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => resolve(), duration));
}


export async function fetchJson(url: string, options?: fetchDataOptions): Promise<FetchResponse> {
    const signal = options?.signal;
    let data: any = null;
    let status = 0;
    let headers: {[key: string]: string} = {};

    try {
        const response = await fetch(url, { signal });

        //await sleep(1500); // TEST

        if (! signal || ! signal.aborted) {
            if (response.ok) {
                data = await response.json();
                status = response.status;
                headers = Object.fromEntries(response.headers);

            } else {
                console.error(`HTTP error! Status: ${response.status}`);
            }
        }

    } catch (error) {
        if (! signal || ! signal.aborted) {
            console.error(error);
        }
    }

    return { data, status, headers } as FetchResponse;
}


export function useFetchJson(url: string): FetchResponse | undefined {
    const [result, setResult] = useState<FetchResponse | undefined>(undefined);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetchJson(url, { signal })
            .then(result => setResult(result));

        return () => {
            abortController.abort();
        }

    }, [url]);

    return result;
}


export function stripTags(text: string): string {
    if (!text) return '';
    const regex = /(<([^>]+)>)/ig;
    return text.replace(regex, "");
}

