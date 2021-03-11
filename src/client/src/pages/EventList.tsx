import React from 'react';
import { Layout } from '../components/event/Layout';
import { ListPanel } from '../components/event/ListPanel';

export function EventList(props: { location: Location; }) {
    return (
        <Layout location={props.location} path={'/event/list'} component={ListPanel} />
    );
}
