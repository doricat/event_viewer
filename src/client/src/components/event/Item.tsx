import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { ApplicationEvent } from '../../models/entity/application';
import { getStyle } from './styleMapping';

export function EventItem(props: { event: ApplicationEvent }) {
    const { id, level, message, category, timestamp } = props.event;
    const style = getStyle(level);

    const openDetail = () => {
        window.open(`/event/index/${id}`);
    };

    return (
        <Alert variant={style} key={id.toString()}>
            <Alert.Heading>{level}</Alert.Heading>
            <p>{message}</p>
            <hr />
            <p className="mb-0">{category} - {new Date(timestamp).toLocaleString()}</p>
            <div className="d-flex justify-content-end">
                <Button variant="outline-info" onClick={() => openDetail()}>在新窗口查看</Button>
            </div>
        </Alert>
    );
}
