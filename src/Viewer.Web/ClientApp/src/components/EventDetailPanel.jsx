import React from 'react';
import { Row, Col } from 'react-bootstrap';
import EventFilter from './EventFilter';
import EventList from './EventList';

export default ({ appId, level }) => {
    return (
        <>
            <Row>
                <Col md={12}>
                    <EventFilter key={appId.toString()} level={level} startTime={new Date()} endTime={new Date()} />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <EventList key={appId.toString()} />
                </Col>
            </Row>
        </>
    );
};