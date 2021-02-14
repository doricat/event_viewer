import React, { useEffect, useState } from 'react';
import { QueryParameterNames } from '../../infrastructure/apiAuthorizationConstants';

export const LoginFailed = () => {
    const [state, setState] = useState<string | null>();

    const getMessage = () => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get(QueryParameterNames.Message);
        setState(error);
    };

    useEffect(() => {
        getMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (state) {
        return (<span>{state}</span>);
    }

    return null;
};