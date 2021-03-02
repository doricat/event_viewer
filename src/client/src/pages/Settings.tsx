import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { ChangeProfile } from '../components/account/ChangeProfile';
import { Security } from '../components/account/Security';
import { SettingsLayout } from '../components/account/SettingsLayout';
import { NormalLayout } from '../components/shared/NormalLayout';

export function Settings() {
    return (
        <NormalLayout>
            <SettingsLayout>
                <Switch>
                    <Route path="/account/settings/profile" component={ChangeProfile} />
                    <Route path="/account/settings/security" component={Security} />
                    <Redirect to="/account/settings/profile" />
                </Switch>
            </SettingsLayout>
        </NormalLayout>
    );
}
