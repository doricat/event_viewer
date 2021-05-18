import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { AuthenticationResultStatus, QueryParameterNames } from '../../infrastructure/apiAuthorizationConstants';
import { getReturnUrl } from '../../infrastructure/urlHelper';
import { MyContext } from '../../configureStore';

export const Login = observer(() => {
    const context = useContext(MyContext);
    const [traceId, setTraceId] = useState(-1);

    const signIn = () => {
        const returnUrl = getReturnUrl(QueryParameterNames.ReturnUrl, window.location.search, window.location.origin);
        setTraceId(context.account.signIn(returnUrl));
    };

    useEffect(() => {
        signIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signState = context.ui.signState.get(traceId);

    if (signState !== undefined) {
        if (signState[0] === AuthenticationResultStatus.Fail) {
            return (<span>{signState[1].message}</span>)
        }
    }

    return (<span>Processing login</span>);
});