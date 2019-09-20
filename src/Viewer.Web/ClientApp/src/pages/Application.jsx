import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ApplicationManagingLayout from '../components/ApplicationManagingLayout';
import ApplicationManagingHelper from '../components/ApplicationManagingHelper';
import ApplicationEditing from '../components/ApplicationEditing';

class Application extends React.Component {
    render() {
        return (
            <ApplicationManagingLayout>
                <Switch>
                    <Route path="/application/create" component={ApplicationEditing} />
                    <Route path="/application" component={ApplicationManagingHelper} />
                </Switch>
            </ApplicationManagingLayout>
        );
    }
}

export default Application;