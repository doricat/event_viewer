import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { LoadFailed } from '../LoadFailed';
import { Loading } from '../Loading';
import { ManagementPanel } from './ManagementPanel';
import { Redirect } from 'react-router';
import { MyContext } from '../../configureStore';

interface Props {
    applicationId: number;
}

export const ManagementPanelContainer = observer((props: Props) => {
    const context = useContext(MyContext);
    const [traceId, setTraceId] = useState(-1);

    const loadApplication = () => {
        setTraceId(context.application.refreshApplication(props.applicationId));
    };

    useEffect(() => {
        loadApplication();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.applicationId]);

    const requestState = context.ui.requestStates.get(traceId);

    if (requestState?.success) {
        const applications = context.application.applications!.filter(x => x.id === props.applicationId);
        if (applications.length < 1) {
            return (<Redirect to={'/404'} />);
        }

        return (<ManagementPanel application={applications[0]} />);
    }

    if (requestState?.failed) {
        return (<LoadFailed message={context.error.operationFailedMessage.get(traceId)?.getMessage()} retry={loadApplication} />);
    }

    return (<Loading />);
});