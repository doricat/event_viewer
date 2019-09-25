import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EventDetail from './EventDetail';
import EventSummary from './EventSummary';

class Event extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/event/summary" component={EventSummary} />
                <Route path="/event/detail" component={EventDetail} />
                <Route path="/event" component={EventSummary} />
            </Switch>
        );
    }
}

export default Event;