import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../../stores';
import { AuthenticationResultStatus } from '../../infrastructure/apiAuthorizationConstants';

export const LogoutCallback = observer(() => {
    const context = useContext(StoreContext);
    const [state, setState] = useState(-1);

    const completeSignOut = () => {
        const traceId = context.account.completeSignOut(window.location.href);
        setState(traceId);
    };

    useEffect(() => {
        completeSignOut();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signState = context.ui.signState.get(state);

    if (signState !== undefined) {
        if (signState[0] === AuthenticationResultStatus.Success) {
            window.location.replace(signState[1].returnUrl as string);
        }

        if (signState[0] === AuthenticationResultStatus.Fail) {
            return (<span>{signState[1].message}</span>)
        }
    }

    return (<span>Processing logout callback</span>);
});