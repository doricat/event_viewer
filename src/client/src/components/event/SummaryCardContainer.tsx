import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from '../../configureStore';
import { EventLevel } from '../../models/shared';
import { LoadFailed } from '../LoadFailed';
import { Loading } from '../Loading';
import { SummaryCard } from './SummaryCard';

interface Props {
    applicationId: number;
    level: EventLevel;
}

export const SummaryCardContainer = observer((props: Props) => {
    const context = useContext(MyContext);
    const [traceId, setTraceId] = useState(-1);

    const refreshData = () => {
        setTraceId(context.application.loadEventStatistics(props.applicationId, props.level));
    };

    useEffect(() => {
        refreshData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.applicationId, props.level]);

    const requestState = context.ui.requestStates.get(traceId);

    if (requestState?.success) {
        const application = context.application.getApplication(props.applicationId)!;
        return (<SummaryCard application={toJS(application)} level={props.level} />);
    }

    if (requestState?.failed) {
        return (<LoadFailed message={context.error.operationFailedMessage.get(traceId)?.getMessage()} retry={refreshData} />);
    }

    return (<Loading />);
})
