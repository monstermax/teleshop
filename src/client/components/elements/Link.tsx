
import React, { useEffect, useState } from 'react';



export const Link = function(props: any) {
    return (
        <a href={props.to ?? '#'}>{props.children}</a>
    );
}


