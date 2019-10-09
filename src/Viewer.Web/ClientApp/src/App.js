import React from 'react';
import './App.css';
import { Route, Switch, Redirect } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import authorizeService from './services/AuthorizeService';
import Layout from './components/Layout'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import EventSummary from './pages/EventSummary';
import EventDetail from './pages/EventDetail';
import Monitor from './pages/Monitor';
import Application from './pages/Application';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

function PrivateRoute({ Component, role, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (authorizeService.isAuthenticated()) {
                    if (role) {
                        if (authorizeService.getRoles().findIndex(x => x.toLowerCase() === role.toLowerCase()) === -1) {
                            return (<Redirect to={{ pathname: "/unauthorized", state: { from: props.location } }} />);
                        }
                    }

                    return (<Component {...props} />);
                }
                else {
                    return (<Redirect to={{ pathname: "/account/login", state: { from: props.location } }} />);
                }
            }}
        />
    );
}

function App({ history }) {
    return (
        <ConnectedRouter history={history}>
            <Layout>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <PrivateRoute path="/event/summary" Component={EventSummary} />
                    <PrivateRoute path="/event/detail" Component={EventDetail} />
                    <PrivateRoute path="/event" Component={EventSummary} />
                    <PrivateRoute path="/monitor" Component={Monitor} />
                    <PrivateRoute path="/application" Component={Application} role="admin" />
                    <PrivateRoute path="/account/profile" Component={Profile} />
                    <PrivateRoute path="/account/settings" Component={Settings} />
                    <Route path="/account/login" component={Login} />
                    <Route path="/account/register" component={Register} />
                    <Route path="/unauthorized" component={Unauthorized} />
                    <Route path="/404" component={NotFound} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </ConnectedRouter>
    );
}

export default App;
