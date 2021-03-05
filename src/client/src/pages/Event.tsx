import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { NormalLayout } from '../components/shared/NormalLayout';
import { EventList } from './EventList';
import { EventSummary } from './EventSummary';

export function Event() {
    return (
        <NormalLayout>
            <Switch>
                <Route path="/event/summary" component={EventSummary} />
                <Route path="/event/list" component={EventList} />
                <Redirect to="/event/summary" />
            </Switch>
        </NormalLayout>
    );
}
