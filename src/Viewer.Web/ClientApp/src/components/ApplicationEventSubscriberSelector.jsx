import React from 'react';
import { Button, Alert, CardColumns } from 'react-bootstrap';
import SubscriberCard from './ApplicationEventSubscriberCard';
import { loading } from './Loading';
import authorizeService from '../services/AuthorizeService';
import { connect } from 'react-redux';
import { actions as uiActions } from '../store/ui';
import { push } from 'connected-react-router';

export class ApplicationEventSubscriberSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            apiResult: null,
            users: [],
            selectedList: undefined
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.selectedList === undefined && props.application) {
            return {
                selectedList: [...props.application.userList]
            };
        }

        return null;
    }

    handleSelect(userId) {
        let selectedList = [...this.state.selectedList];
        const index = selectedList.findIndex(x => x === userId);
        if (index === -1) {
            selectedList.push(userId);
        } else {
            selectedList.splice(index, 1);
        }
        this.setState({ selectedList });
    }

    async save() {
        this.setState({ isSubmitting: true, apiResult: null });

        const token = await authorizeService.getAccessToken();
        let headers = !token ? {} : { "Authorization": `Bearer ${token}` };
        headers["Content-Type"] = "application/json";
        const response = await fetch(`/api/applications/${this.props.application.id}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({
                userList: this.state.selectedList
            })
        });

        this.setState({ isSubmitting: false });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.status >= 400 && response.status < 500) {
                const { code, message } = json.error;
                this.setState({ apiResult: { code, message } });
                return;
            }

            if (response.status === 500) {
                this.props.dispatch(uiActions.setGlobalError(true, json.error.message));
                return;
            }

            console.error(json);
        } else {
            if (response.ok === true) {
                this.props.dispatch(push(`/application/${this.props.application.id}`));
                return;
            }

            if (response.status === 401) {
                authorizeService.signOut();
                this.props.dispatch(push("/account/login"));
                return;
            }
        }
    }

    async loadAllUsers() {
        const token = await authorizeService.getAccessToken();
        const response = await fetch("/api/accounts", {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.ok === true) {
                this.setState({ users: json.value })
                return;
            }

            if (response.status >= 400 && response.status < 500) {
                const { code, message } = json.error;
                this.setState({ apiResult: { code, message } });
                return;
            }

            if (response.status === 500) {
                this.props.setGlobalError(json.error.message)
                return;
            }

            console.error(json);
        } else {
            if (response.status === 401) {
                authorizeService.signOut();
                this.props.redirectToLogin()
                return;
            }

            if (response.status === 403) {
                this.props.redirectToUnauthorized();
                return;
            }
        }
    }

    componentDidMount() {
        this.loadAllUsers();
    }

    render() {
        const { isSubmitting } = this.state;

        return (
            <>
                {
                    this.state.apiResult !== null
                        ?
                        <Alert variant="warning">{this.state.apiResult.message}</Alert>
                        :
                        null
                }
                <CardColumns style={{ columnCount: "5" }}>
                    {this.state.users.map(user => (
                        <SubscriberCard
                            user={user}
                            selected={this.state.selectedList.findIndex(x => x === user.id) !== -1}
                            select={(x, y) => this.handleSelect(x, y)}
                            isSubmitting={isSubmitting}
                            key={user.id.toString()} />))}
                </CardColumns>

                <br />
                <Button variant="primary" className="mr-2" disabled={isSubmitting} onClick={() => this.save()}>保存</Button>
                <Button variant="secondary" disabled={isSubmitting} onClick={() => this.props.cancel(this.props.application.id)}>放弃</Button>
            </>
        );
    }
}


export default loading(connect(null, dispatch => {
    return {
        cancel: (id) => dispatch(push(`/application/${id}`)),
        redirectToLogin: () => dispatch(push("/account/login")),
        redirectToUnauthorized: () => dispatch(push("/unauthorized")),
        setGlobalError: (message) => dispatch(uiActions.setGlobalError(true, message))
    }
})(ApplicationEventSubscriberSelector), () =>
    (
        <Alert variant="info"><i>加载中...</i></Alert>
    )
);