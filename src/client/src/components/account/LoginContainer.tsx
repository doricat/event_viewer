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

    const requestState = context.ui.requestStates.get(traceId);

    if (requestState === 'success') {
        return React.createElement(props.component);
    }

    if (requestState === 'failed') {
        return (<span>{context.error.messages.get(traceId)?.getMessage()}</span>)
    }

    return (<span>Processing</span>);
});