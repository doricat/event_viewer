import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { LoadFailed } from '../LoadFailed';
import { StoreContext } from '../../stores';
import { Loading } from '../Loading';
import { SubscriberSelector } from './SubscriberSelector';

interface Props {
    applicationId: number;
}

export const SubscriberSelectorContainer = observer((props: Props) => {
    const context = useContext(StoreContext);
    const [applicationTraceId, setApplicationTraceId] = useState(-1);
    const [usersTraceId, setUsersTraceId] = useState(-1);

    const refreshData = () => {
        setApplicationTraceId(context.application.refreshApplication(props.applicationId));
        setUsersTraceId(context.user.loadUsers());
    };

    useEffect(() => {
        refreshData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.applicationId]);

    const requestState1 = context.ui.requestStates.get(applicationTraceId);
    const requestState2 = context.ui.requestStates.get(usersTraceId);

    if (requestState1?.success && requestState2?.success) {
        const application = context.application.applications.filter(x => x.id === props.applicationId);
        const users = context.user.users;
        return (<SubscriberSelector application={application[0]} users={users} />);
    }

    if (requestState1?.failed) {
        return (<LoadFailed message={context.error.operationFailedMessage.get(applicationTraceId)?.getMessage()} retry={refreshData} />);
    }

    if (requestState2?.failed) {
        return (<LoadFailed message={context.error.operationFailedMessage.get(usersTraceId)?.getMessage()} retry={refreshData} />);
    }

    return (<Loading />);
});