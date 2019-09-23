import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ApplicationManagingLayout from '../components/ApplicationManagingLayout';
import ApplicationManagingHelper from '../components/ApplicationManagingHelper';
import ApplicationManagingPanel from '../components/ApplicationManagingPanel';
import { connect } from 'react-redux';
import { actions as applicationActions } from '../store/application';
import { actions as userActions } from '../store/user'
import ApplicationEditingForm from '../components/ApplicationEditingForm';
import ApplicationEventSubscriberSelector from '../components/ApplicationEventSubscriberSelector';

class Application extends React.Component {
    loadDetail(id) {
        this.props.dispatch(applicationActions.fetchLoadApplicationDetail(id, false));
    }

    removeApp(id, callback) {
        this.props.dispatch(applicationActions.fetchDeleteApplication(id, callback));
    }

    loadUsers() {
        this.props.dispatch(userActions.fetchGetUsers());
    }

    render() {
        return (
            <ApplicationManagingLayout>
                <Switch>
                    <Route path="/application/create" render={({ history }) => (<ApplicationEditingForm application={null} cancel={() => history.goBack()} />)} />
                    <Route path="/application/:id/edit" render={({ history }) => (<ApplicationEditingForm application={this.props.applicationDetail} cancel={() => history.goBack()} />)} />
                    <Route path="/application/:id/subscribers" render={(props) => (<ApplicationEventSubscriberSelector
                        loading={this.props.userListLoadingState || this.props.applicationDetailLoadingState}
                        application={this.props.applicationDetail}
                        users={this.props.users}
                        cancel={() => props.history.goBack()}
                        loadDetail={id => this.loadDetail(id)}
                        loadUsers={() => this.loadUsers()}
                        {...props} />)} />
                    <Route path="/application/:id" render={(props) => (<ApplicationManagingPanel
                        loading={this.props.applicationDetailLoadingState}
                        detail={this.props.applicationDetail}
                        loadDetail={id => this.loadDetail(id)}
                        removeApp={(id, callback) => this.removeApp(id, callback)}
                        loadUsers={() => this.loadUsers()}
                        {...props} />)} />
                    <Route path="/application" component={ApplicationManagingHelper} />
                </Switch>
            </ApplicationManagingLayout>
        );
    }
}

export default connect(state => {
    return {
        applicationDetailLoadingState: state.ui.applicationDetailLoadingState,
        applicationDetail: state.application.detail,
        users: state.user.list,
        userListLoadingState: state.ui.userListLoadingState
    };
})(Application);