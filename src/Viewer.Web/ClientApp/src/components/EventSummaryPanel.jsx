import React from 'react';
import { CardColumns } from 'react-bootstrap';
import { connect } from 'react-redux';
import EventSummaryCard from './EventSummaryCard';
import authorizeService from '../services/AuthorizeService';
import { actions as uiActions } from '../store/ui';
import { push } from 'connected-react-router';

class EventSummaryPanel extends React.Component {
    constructor(props) {
        super(props);

        const obj = {
            loading: true,
            apiResult: undefined,
            apiError: null
        };

        this.state = {
            critical: obj,
            error: obj,
            warning: obj,
            info: obj,
            debug: obj,
            trace: obj
        };
    }

    async loadSummary(id, level) {
        const token = await authorizeService.getAccessToken();
        const response = await fetch(`/api/applications/${id}/events/statistics/${level}`, {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            let key = level.toLowerCase();
            key = key === "information" ? "info" : key;

            if (response.ok === true) {
                let state = {};
                state[key] = {
                    loading: false,
                    apiError: null,
                    apiResult: json.value
                };
                this.setState(state);
                return;
            }

            if (response.status >= 400 && response.status < 500) {
                const { code, message } = json.error;
                let state = {};
                state[key] = {
                    apiError: { code, message },
                    loading: false,
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
        const { appId } = this.props;
        return (
            <CardColumns>
                <EventSummaryCard appId={appId} level="Critical" loading={this.state.critical.loading} load={() => this.loadSummary(appId, "Critical")} statisticsResult={this.state.critical.apiResult} />
                <EventSummaryCard appId={appId} level="Error" loading={this.state.error.loading} load={() => this.loadSummary(appId, "Error")} statisticsResult={this.state.error.apiResult} />
                <EventSummaryCard appId={appId} level="Warning" loading={this.state.warning.loading} load={() => this.loadSummary(appId, "Warning")} statisticsResult={this.state.warning.apiResult} />
                <EventSummaryCard appId={appId} level="Info" loading={this.state.info.loading} load={() => this.loadSummary(appId, "Information")} statisticsResult={this.state.info.apiResult} />
                <EventSummaryCard appId={appId} level="Debug" loading={this.state.debug.loading} load={() => this.loadSummary(appId, "Debug")} statisticsResult={this.state.debug.apiResult} />
                <EventSummaryCard appId={appId} level="Trace" loading={this.state.trace.loading} load={() => this.loadSummary(appId, "Trace")} statisticsResult={this.state.trace.apiResult} />
            </CardColumns>
        );
    }
}

export default connect()(EventSummaryPanel);