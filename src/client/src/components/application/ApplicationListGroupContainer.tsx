import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../../stores';
import { LoadFailed } from '../LoadFailed';
import { Loading } from '../Loading';
import { ApplicationListGroup } from './ApplicationListGroup';

export const ApplicationListGroupContainer = observer(() => {
    const context = useContext(StoreContext);
    const [traceId, setTraceId] = useState(-1);

    const loadApplications = () => {
        setTraceId(context.application.loadApplications());
    };

    useEffect(() => {
        loadApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const requestState = context.ui.requestStates.get(traceId);

    if (requestState?.success) {
        const applications: [number, string][] = [];
        context.application.applications.map(x => applications.push([x.id, x.name]));
        return (<ApplicationListGroup applications={applications} />);
    }

    if (requestState?.failed) {
        return (<LoadFailed message={context.error.operationFailedMessage.get(traceId)?.getMessage()} retry={loadApplications} />);
    }

    return (<Loading />);
});
