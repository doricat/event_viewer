import React, { useState, useEffect, useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';
import { EventFilter } from './Filter';
import { EventList } from './List';
import { FilterModel } from '../../models/view/event';
import { MyContext } from '../../configureStore';

export const ListPanel = observer((props: { applicationId: number }) => {
    const context = useContext(MyContext);
    const [filter] = useState<FilterModel>(() => new FilterModel('all'));
    const [traceId, setTraceId] = useState(-1);
    const firstRender = useRef(true);

    const loadEvents = () => {
        setTraceId(context.event.loadEvents(props.applicationId, filter.toFilter(), filter.top, filter.skip));
    };

    useEffect(() => {
        if (firstRender.current) {
            filter.update(context.router.location.search);
        } else {
            loadEvents();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.router.location]);

    useEffect(() => {
        if (!firstRender.current) {
            context.router.push(filter.toQuery(props.applicationId));
        }

        firstRender.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.level, filter.startTime, filter.endTime, filter.top, filter.skip]);

    const requestState = context.ui.requestStates.get(traceId);

    return (
        <>
            <Row>
                <Col md={12}>
                    <EventFilter key={props.applicationId.toString()} model={filter} requestState={requestState} loadEvents={loadEvents} />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <EventList key={props.applicationId.toString()} model={filter} />
                </Col>
            </Row>
        </>
    );
});
