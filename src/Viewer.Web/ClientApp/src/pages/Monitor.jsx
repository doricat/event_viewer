import React from 'react';
import { Row, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actions as uiActions } from '../store/ui';
import { actions as applicationActions } from '../store/application';
import EventLevelFilter from '../components/EventLevelFilter';
import EventNavMenu from '../components/EventNavMenu';
import EventBox from '../components/EventBox';
import EventHelper from '../components/EventHelper';
import authorizeService from '../services/AuthorizeService';
import { push } from 'connected-react-router';

import "./Monitor.css";

const levels = ["critical", "error", "warning", "information", "debug", "trace"];

class Monitor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: true,
            connectionId: undefined,
            apiError: null,
            apiResult: null,
            levels: [...levels]
        };

        this.appId = undefined;
    }

    setLevel(level) {
        let arr;
        let val = level;
        const i = this.state.levels.findIndex((x) => x === level);
        if (i !== -1) {
            arr = [...this.state.levels];
            arr.splice(i, 1);
            val = `-${level}`;
        } else {
            arr = [...this.state.levels, level];
        }

        this.setState({ levels: arr, isSubmitting: true }, async () => {
            const token = await authorizeService.getAccessToken();
            let headers = !token ? {} : { "Authorization": `Bearer ${token}` };
            headers["Content-Type"] = "application/json";

            const response = await fetch(`/api/monitor_settings/${this.state.connectionId}`, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify({
                    appId: this.appId,
                    level: val
                })
            });

            const contentType = response.headers.get("content-type") || "";
            if (contentType.startsWith("application/json")) {
                const json = await response.json();

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

            this.setState({ isSubmitting: false });
        });
    }

    connectedCallback(connectionId) {
        // 重置部分状态
        this.setState({ isSubmitting: false, connectionId: connectionId, levels: [...levels] })
    }

    componentDidMount() {
        this.props.fixNavMenu();
    }

    componentWillUnmount() {
        this.props.unfixNavMenu();
    }

    render() {
        const params = new URLSearchParams(this.props.location.search);
        this.appId = params.get("application");
        const content = this.appId
            ? <EventBox appId={this.appId} key={this.appId} connectedCallback={(id) => this.connectedCallback(id)} />
            : <EventHelper />;

        return (
            <Row>
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                        {
                            this.state.apiResult !== null
                                ?
                                <Alert variant="warning">{this.state.apiResult.message}</Alert>
                                :
                                null
                        }
                        <EventLevelFilter isSubmitting={this.state.isSubmitting} levels={this.state.levels} setLevel={level => this.setLevel(level)} />
                        <br />
                        <EventNavMenu
                            pathname="/monitor"
                            applications={this.props.applications}
                            load={(callback) => this.props.loadApplications(callback)} />
                    </div>
                </nav>
                <div className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
                    {content}
                </div>
            </Row>
        );
    }
}

export default connect(state => {
    return {
        applications: state.application.list
    };
}, dispatch => {
    return {
        loadApplications: (callback) => dispatch(applicationActions.fetchGetApplications(callback)),
        fixNavMenu: () => dispatch(uiActions.fixNavMenu()),
        unfixNavMenu: () => dispatch(uiActions.unfixNavMenu()),
        redirectToLogin: () => dispatch(push("/account/login")),
        setGlobalError: (message) => dispatch(uiActions.setGlobalError(true, message))
    };
})(Monitor);