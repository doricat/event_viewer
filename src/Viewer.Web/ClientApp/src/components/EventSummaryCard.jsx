import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { loading } from './Loading';
import { getStyle } from './eventLevelStyle';

const date = new Date();

const defaultStatisticsResult = {
    last1Hour: 0,
    last24Hours: 0,
    last7Days: 0,
    oneHourAgo: date,
    oneDayAgo: date,
    sevenDaysAgo: date,
    endTime: date
};

const EventSummaryCard = ({ level, appId, statisticsResult = defaultStatisticsResult }) => {
    const pathName = "/event/detail";
    let search = `?application=${appId}&level=${level}`;
    let border = getStyle(level);

    return (
        <Card border={border}>
            <Card.Header>{level}</Card.Header>
            <ListGroup className="list-group-flush">
                <Link className="list-group-item list-group-item-action" role="tab" tabIndex="-1"
                    to={{
                        pathname: pathName,
                        search: search,
                        state: {
                            startTime: statisticsResult.oneHourAgo,
                            endTime: statisticsResult.endTime,
                            fromSummary: true
                        }
                    }}>近1小时：{statisticsResult.last1Hour}</Link>
                <Link className="list-group-item list-group-item-action" role="tab" tabIndex="-1"
                    to={{
                        pathname: pathName,
                        search: search,
                        state: {
                            startTime: statisticsResult.oneDayAgo,
                            endTime: statisticsResult.endTime,
                            fromSummary: true
                        }
                    }}>24小时：{statisticsResult.last24Hours}</Link>
                <Link className="list-group-item list-group-item-action" role="tab" tabIndex="-1"
                    to={{
                        pathname: pathName,
                        search: search,
                        state: {
                            startTime: statisticsResult.sevenDaysAgo,
                            endTime: statisticsResult.endTime,
                            fromSummary: true
                        }
                    }}>7天：{statisticsResult.last7Days}</Link>
            </ListGroup>
        </Card>
    );
};

export default loading(EventSummaryCard, ({ level }) => {
    return (
        <Card border={getStyle(level)}>
            <Card.Header>{level}</Card.Header>
            <Card.Body>加载中...</Card.Body>
        </Card>
    );
});