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
            userList: [...props.application.userList]
        };
    }

    handleSelect(userId) {
        let userList = [...this.state.userList];
        const index = userList.findIndex(x => x === userId);
        if (index === -1) {
            userList.push(userId);
        } else {
            userList.splice(index, 1);
        }
        this.setState({ userList });
    }

    async save() {
        this.setState({ isSubmitting: true });

        const token = await authorizeService.getAccessToken();
        let headers = !token ? {} : { "Authorization": `Bearer ${token}` };
        headers["Content-Type"] = "application/json";
        const response = await fetch(`/api/applications/${this.props.application.id}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({
                userList: this.state.userList
            })
        });

        this.setState({ isSubmitting: false });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            // if (response.ok === true) {
            // return;
            // }

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
                this.props.dispatch(push(`/application/${this.props.match.params.id}`));
                return;
            }

            if (response.status === 401) {
                authorizeService.signOut();
                this.props.dispatch(push("/account/login"));
                return;
            }
        }
    }

    UNSAFE_componentWillMount() {
        const { location, match, loadUsers, loadDetail } = this.props;
        if (location.state === undefined && this.props.loading === false) {
            loadDetail(match.params.id);
            loadUsers();
        }
    }

    render() {
        if (this.props.users && this.props.users.length > 0) {
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
                        {this.props.users.map(user => (
                            <SubscriberCard
                                user={user}
                                selected={this.state.userList.findIndex(x => x === user.id) !== -1}
                                select={(x, y) => this.handleSelect(x, y)}
                                isSubmitting={isSubmitting}
                                key={user.id.toString()} />))}
                    </CardColumns>

                    <br />
                    <Button variant="primary" className="mr-2" disabled={isSubmitting} onClick={() => this.save()}>保存</Button>
                    <Button variant="secondary" disabled={isSubmitting} onClick={() => this.props.cancel()}>放弃</Button>
                </>
            );
        }

        return LoadingAlert();
    }
}

const LoadingAlert = () => (<Alert variant="info"><i>加载中...</i></Alert>);

export default connect()(loading(ApplicationEventSubscriberSelector, LoadingAlert));