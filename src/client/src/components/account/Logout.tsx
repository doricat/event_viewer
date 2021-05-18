import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { AuthenticationResultStatus, QueryParameterNames } from '../../infrastructure/apiAuthorizationConstants';
import { getReturnUrl } from '../../infrastructure/urlHelper';
import { MyContext } from '../../configureStore';

export const Logout = observer(() => {
    const context = useContext(MyContext);
    const [state, setState] = useState(-1);

    const signOut = () => {
        const returnUrl = getReturnUrl(QueryParameterNames.ReturnUrl, window.location.search, window.location.origin);
        const traceId = context.account.signOut(returnUrl);
        setState(traceId);
    };

    useEffect(() => {
        signOut();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signState = context.ui.signState.get(state);

    if (signState !== undefined) {
        if (signState[0] === AuthenticationResultStatus.Fail) {
            return (<span>{signState[1].message}</span>)
        }
    }

    return (<span>Processing logout</span>);
});