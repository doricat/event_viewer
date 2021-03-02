import React, { useEffect } from 'react';

interface Props {
    url: string;
}

export const Redirect = (props: Props) => {
    const redirect = () => {
        const redirectUrl = `${window.location.origin}${props.url}`;
        window.location.replace(redirectUrl);
    };

    useEffect(() => {
        redirect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<div></div>);
};