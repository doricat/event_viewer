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

    async loadSummary(id, level, callback) {
        const token = await authorizeService.getAccessToken();
        const response = await fetch(`/api/applications/${id}/events/statistics/${level}`, {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        callback();

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            let key = level.toLowerCase();
            key = key === "information" ? "info" : key;

            if (response.ok === true) {
                let state = {};
                state[key] = {
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
                    apiResult: undefined
                };
                this.setState(state);
                return;
            }

            if (response.status === 500) {
                this.props.setGlobalError(json.error.message);
                return;
            }

            console.error(json);
        } else {
            if (response.status === 401) {
                authorizeService.signOut();
                this.props.redirectToLogin();
            }
        }
    }

    render() {
        const { appId } = this.props;
        return (
            <CardColumns>
                <EventSummaryCard appId={appId} level="Critical" load={(callback) => this.loadSummary(appId, "Critical", callback)} statisticsResult={this.state.critical.apiResult} />
                <EventSummaryCard appId={appId} level="Error" load={(callback) => this.loadSummary(appId, "Error", callback)} statisticsResult={this.state.error.apiResult} />
                <EventSummaryCard appId={appId} level="Warning" load={(callback) => this.loadSummary(appId, "Warning", callback)} statisticsResult={this.state.warning.apiResult} />
                <EventSummaryCard appId={appId} level="Info" load={(callback) => this.loadSummary(appId, "Information", callback)} statisticsResult={this.state.info.apiResult} />
                <EventSummaryCard appId={appId} level="Debug" load={(callback) => this.loadSummary(appId, "Debug", callback)} statisticsResult={this.state.debug.apiResult} />
                <EventSummaryCard appId={appId} level="Trace" load={(callback) => this.loadSummary(appId, "Trace", callback)} statisticsResult={this.state.trace.apiResult} />
            </CardColumns>
        );
    }
}

export default connect(null, dispatch => {
    return {
        redirectToLogin: () => dispatch(push("/account/login")),
        setGlobalError: (message) => dispatch(uiActions.setGlobalError(true, message))
    };
})(EventSummaryPanel);