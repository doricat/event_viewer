import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../../stores';
import { AuthenticationResultStatus } from '../../infrastructure/apiAuthorizationConstants';

export const LoginCallback = observer(() => {
    const context = useContext(StoreContext);
    const [traceId, setTraceId] = useState(-1);

    const completeSignIn = () => {
        setTraceId(context.account.completeSignIn(window.location.href));
    };

    useEffect(() => {
        completeSignIn();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signState = context.ui.signState.get(traceId);

    if (signState !== undefined) {
        if (signState[0] === AuthenticationResultStatus.Success) {
            window.location.replace(signState[1].returnUrl as string);
        }

        if (signState[0] === AuthenticationResultStatus.Fail) {
            return (<span>{signState[1].message}</span>)
        }
    }

    return (<span>Processing login callback</span>);
});