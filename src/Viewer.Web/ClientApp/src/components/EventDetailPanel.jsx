import React from 'react';
import { Row, Col } from 'react-bootstrap';
import EventFilter from './EventFilter';
import EventList from './EventList';
import authorizeService from '../services/AuthorizeService';
import { actions as uiActions } from '../store/ui';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

const $top = 20;

const buildFilter = ({ level, startTime, endTime }) => {
    const filters = [];
    level = level.toLowerCase();
    if (level !== "all") {
        level = level === "info" ? "information" : level;
        filters.push(`level eq '${level}'`);
    }

    if (startTime) {
        filters.push(`timestamp ge '${startTime.toLocaleDateString("zh-cn")} ${startTime.toLocaleTimeString("en-GB")}'`);
    }

    if (endTime) {
        filters.push(`timestamp le '${endTime.toLocaleDateString("zh-cn")} ${endTime.toLocaleTimeString("en-GB")}'`);
    }

    return filters.join(" and ");
};

class EventDetailPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            apiError: null,
            apiResult: null,
            list: []
        };

        this.filter = undefined;
        this.loading = false;
        this.queryDetail.bind(this);
    }

    async queryDetail(level, startTime, endTime, callback) {
        this.filter = { level, startTime, endTime, skip: 0 };
        this.query();
        callback();
    }

    async loadMore() {
        if (this.loading === true) {
            return;
        }
        this.filter.skip = this.filter.skip + $top;
        console.log(this.filter);
        // await this.query();
        this.loading = true;
    }

    async query() {
        const { appId } = this.props;
        const token = await authorizeService.getAccessToken();
        const response = await fetch(`/api/applications/${appId}/events?$filter=${buildFilter(this.filter)}&$top=${$top}&$skip=${this.filter.skip}`, {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.ok === true) {
                let state = {
                    apiError: null,
                    apiResult: json,
                    list: [...this.state.list, ...json.value]
                };
                this.setState(state);
                return;
            }

            if (response.status >= 400 && response.status < 500) {
                const { code, message } = json.error;
                let state = {
                    apiError: { code, message },
                    apiResult: undefined
                };
                this.setState(state);
                return;
            }

            if (response.status === 500) {
                this.props.dispatch(uiActions.setGlobalError(true, json.error.message));
                return;
            }

            console.error(json);
        } else {
            if (response.status === 401) {
                authorizeService.signOut();
                this.props.dispatch(push("/account/login"));
            }
        }
    }

    render() {
        const { appId, level, startTime, endTime, fromSummary } = this.props;
        return (
            <>
                <Row>
                    <Col md={12}>
                        <EventFilter key={appId.toString()}
                            level={level}
                            startTime={startTime ? new Date(startTime) : null}
                            endTime={endTime ? new Date(endTime) : null}
                            fromSummary={fromSummary}
                            onQuery={(level, startTime, endTime, callback) => this.queryDetail(level, startTime, endTime, callback)} />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <EventList key={appId.toString()} list={this.state.list} loadMore={() => this.loadMore()} />
                    </Col>
                </Row>
            </>
        );
    }
}

export default connect()(EventDetailPanel);