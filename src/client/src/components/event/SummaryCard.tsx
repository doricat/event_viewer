import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Application } from '../../models/entity/application';
import { EventLevel } from '../../models/shared';
import { getStyle } from './styleMapping';

interface Props {
    application: Application;
    level: EventLevel;
}

export function SummaryCard(props: Props) {
    const count = props.application.eventStatistics.get(props.level);
    if (count === undefined) {
        throw new Error();
    }

    const path = '/event/list';
    const search = `?application=${props.application.id}&level=${props.level}`;
    const border = getStyle(props.level);

    return (
        <Card border={border}>
            <Card.Header>{props.level}</Card.Header>
            <ListGroup className="list-group-flush">
                <Link className="list-group-item list-group-item-action" role="tab" tabIndex={-1}
                    to={{ pathname: path, search: `${search}&startTime=${encodeURIComponent(count.oneHourAgo)}&endTime=${encodeURIComponent(count.endTime)}` }}>
                    近1小时：{count.last1Hour}</Link>
                <Link className="list-group-item list-group-item-action" role="tab" tabIndex={-1}
                    to={{ pathname: path, search: `${search}&startTime=${encodeURIComponent(count.oneDayAgo)}&endTime=${encodeURIComponent(count.endTime)}` }}>
                    24小时：{count.last24Hours}</Link>
                <Link className="list-group-item list-group-item-action" role="tab" tabIndex={-1}
                    to={{ pathname: path, search: `${search}&startTime=${encodeURIComponent(count.sevenDaysAgo)}&endTime=${encodeURIComponent(count.endTime)}` }}>
                    7天：{count.last7Days}</Link>
            </ListGroup>
        </Card>
    );
}
