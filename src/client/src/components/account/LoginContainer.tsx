import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../../stores';

interface Props {
    component: () => JSX.Element;
}

export const LoginContainer = observer((props: Props) => {
    const context = useContext(StoreContext);
    const [traceId, setTraceId] = useState(-1);

    const loadSettings = () => {
        setTraceId(context.account.loadOidcSettings());
    };

    useEffect(() => {
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const state = context.ui.requestStates.get(traceId);

    if (state?.success) {
        return React.createElement(props.component);
    }

    if (state?.failed) {
        return (<span>{context.error.operationFailedMessage.get(traceId)?.getMessage()}</span>)
    }

    return (<span>Processing</span>);
});