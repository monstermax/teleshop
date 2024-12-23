
import React, { useEffect, useState } from 'react';

import { fetchJson, useFetchJson } from '../lib/utils.client';



export const ExampleReactComponent = (props: any) => {
    const fetchResponse = useFetchJson('/example/api/date');
    const [val, setVal] = useState(fetchResponse?.data || 'loading (10%)...');

    // toggle button text
    const btnClick = () => setVal(val === 'ying' ? 'yang' : 'ying');

    const btnTwoClick = () => {
        // reload api data
        fetchJson('/example/api/date')
            .then(result => setVal(result.data));
    }

    useEffect(() => {
        setVal(fetchResponse?.data || 'loading (80%)');
    }, [fetchResponse?.data]);

    return (
        <>
            Example React + API
            <hr />
            <button onClick={() => btnClick()}>click me</button>
            <button onClick={() => btnTwoClick()}>reload</button>
            <hr />
            {(val === null) && <>loading (40%)...</>}
            {(val !== null) && <>{JSON.stringify(val)}</>}
        </>
    );
}

