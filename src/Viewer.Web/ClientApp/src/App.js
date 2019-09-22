import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import Layout from './components/Layout'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Event from './pages/Event';
import Monitor from './pages/Monitor';
import Application from './pages/Application';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';

function App({ history }) {
    return (
        <ConnectedRouter history={history}>
            <Layout>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/event" component={Event} />
                    <Route path="/monitor" component={Monitor} />
                    <Route path="/application" component={Application} />
                    <Route path="/account/login" component={Login} />
                    <Route path="/account/register" component={Register} />
                    <Route path="/account/profile" component={Profile} />
                    <Route path="/account/settings" component={Settings} />
                    <Route path="/unauthorized" component={Unauthorized} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </ConnectedRouter>
    );
}

export default App;
