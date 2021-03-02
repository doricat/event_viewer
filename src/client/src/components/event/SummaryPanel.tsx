import React from 'react';
import { CardColumns } from 'react-bootstrap';
import { SummaryCardContainer } from './SummaryCardContainer';

interface Props {
    applicationId: number;
}

export function SummaryPanel(props: Props) {
    const { applicationId } = props;
    return (
        <CardColumns>
            <SummaryCardContainer applicationId={applicationId} level="critical" />
            <SummaryCardContainer applicationId={applicationId} level="error" />
            <SummaryCardContainer applicationId={applicationId} level="warning" />
            <SummaryCardContainer applicationId={applicationId} level="information" />
            <SummaryCardContainer applicationId={applicationId} level="debug" />
            <SummaryCardContainer applicationId={applicationId} level="trace" />
        </CardColumns>
    );
}
