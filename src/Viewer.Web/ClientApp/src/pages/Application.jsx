import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ApplicationManagingLayout from '../components/ApplicationManagingLayout';
import ApplicationManagingHelper from '../components/ApplicationManagingHelper';
import ApplicationManagingPanel from '../components/ApplicationManagingPanel';
import { connect } from 'react-redux';
import { actions as applicationActions } from '../store/application';
import ApplicationEditingForm from '../components/ApplicationEditingForm';
import ApplicationEventSubscriberSelector from '../components/ApplicationEventSubscriberSelector';

class Application extends React.Component {
    render() {
        return (
            <ApplicationManagingLayout>
                <Switch>
                    <Route path="/application/create" render={() => (<ApplicationEditingForm
                        application={null}
                        load={(callback) => callback()} />)} />
                    <Route path="/application/:id/edit" render={({ match }) => (<ApplicationEditingForm
                        application={this.props.applicationDetail}
                        load={(callback) => this.props.loadApplicationDetail(match.params.id, callback)}
                        key={match.params.id} />)} />
                    <Route path="/application/:id/subscribers" render={({ match }) => (<ApplicationEventSubscriberSelector
                        application={this.props.applicationDetail}
                        load={(callback) => this.props.loadApplicationDetail(match.params.id, callback)}
                        key={match.params.id} />)} />
                    <Route path="/application/:id" render={({ match }) => (<ApplicationManagingPanel
                        application={this.props.applicationDetail}
                        load={(callback) => this.props.loadApplicationDetail(match.params.id, callback)}
                        key={match.params.id} />)} />
                    <Route path="/application" component={ApplicationManagingHelper} />
                </Switch>
            </ApplicationManagingLayout>
        );
    }
}

export default connect(state => {
    return {
        applicationDetail: state.application.detail
    };
}, dispatch => {
    return {
        loadApplicationDetail: (id, callback) => dispatch(applicationActions.fetchLoadApplicationDetail(id, callback))
    };
})(Application);