import React from 'react';
import { Layout } from '../components/event/Layout';
import { SummaryPanel } from '../components/event/SummaryPanel';

export function EventSummary(props: { location: Location; }) {
    return (
        <Layout location={props.location} path={'/event/summary'} component={SummaryPanel} />
    );
}
