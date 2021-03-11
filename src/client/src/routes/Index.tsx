import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Application } from '../pages/Application';
import { Home } from '../pages/Home';
import { Monitor } from '../pages/Monitor';
import { NotFound } from '../pages/NotFound';
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { Unauthorized } from '../pages/Unauthorized';
import { Event } from '../pages/Event';
import { LoginContainer } from '../components/account/LoginContainer';
import { Login } from '../components/account/Login';
import { ApplicationPaths, QueryParameterNames } from '../infrastructure/apiAuthorizationConstants';
import { LoginFailed } from '../components/account/LoginFailed';
import { LoginCallback } from '../components/account/LoginCallback';
import { Redirect } from '../components/account/Redirect';

export const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/account/settings" component={Settings} />
            <Route path="/account/profile" component={Profile} />
            <Route path="/application" component={Application} />
            <Route path="/event" component={Event} />
            <Route path="/monitor" component={Monitor} />
            <Route path="/unauthorized" component={Unauthorized} />
            <Route path={ApplicationPaths.Login} render={() => <LoginContainer component={Login} />} />
            <Route path={ApplicationPaths.LoginFailed} render={() => <LoginFailed />} />
            <Route path={ApplicationPaths.LoginCallback} render={() => <LoginContainer component={LoginCallback} />} />
            <Route path={ApplicationPaths.Profile} render={() => <Redirect url={ApplicationPaths.IdentityManagePath} />} />
            <Route path={ApplicationPaths.Register} render={() => <Redirect url={`${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(ApplicationPaths.Login)}`} />} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
        </Switch>
    );
};
