import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SettingsLayout from '../components/SettingsLayout';
import ChangeProfile from '../components/ChangeProfile';
import Security from '../components/Security';

export default () => {
    return (
        <SettingsLayout>
            <Switch>
                <Route path="/account/settings/profile" component={ChangeProfile} />
                <Route path="/account/settings/security" component={Security} />
                <Redirect to="/account/settings/profile" />
            </Switch>
        </SettingsLayout>
    );
};