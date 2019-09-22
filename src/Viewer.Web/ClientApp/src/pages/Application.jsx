import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ApplicationManagingLayout from '../components/ApplicationManagingLayout';
import ApplicationManagingHelper from '../components/ApplicationManagingHelper';
import ApplicationEditing from '../components/ApplicationEditing';
import ApplicationManagingPanel from '../components/ApplicationManagingPanel';
import { connect } from 'react-redux';
import { actions as applicationActions } from '../store/application';
import ApplicationEditingForm from '../components/ApplicationEditingForm';

class Application extends React.Component {
    loadDetail(id) {
        this.props.dispatch(applicationActions.fetchLoadApplicationDetail(id, false));
    }

    removeApp(id, callback) {
        this.props.dispatch(applicationActions.fetchDeleteApplication(id, callback));
    }

    render() {
        return (
            <ApplicationManagingLayout>
                <Switch>
                    <Route path="/application/create" component={ApplicationEditing} />
                    <Route path="/application/:id/edit" render={({ history }) => (<ApplicationEditingForm application={this.props.applicationDetail} cancel={() => history.goBack()} />)} />
                    <Route path="/application/:id" render={(props) => (<ApplicationManagingPanel
                        loading={this.props.applicationDetailLoadingState}
                        detail={this.props.applicationDetail}
                        loadDetail={id => this.loadDetail(id)}
                        removeApp={(id, callback) => this.removeApp(id, callback)}
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
        applicationDetail: state.application.detail
    };
})(Application);