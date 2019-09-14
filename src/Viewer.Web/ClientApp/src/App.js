import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Event from './pages/Event';
import Monitor from './pages/Monitor';
import Application from './pages/Application';

function App({ history }) {
    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/event" component={Event} />
                <Route path="/monitor" component={Monitor} />
                <Route path="/application" component={Application} />
                <Route component={NotFound} />
            </Switch>
        </ConnectedRouter>
    );
}

export default App;
