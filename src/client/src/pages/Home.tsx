import React from 'react';
import { Alert } from 'react-bootstrap';
import { NormalLayout } from '../components/shared/NormalLayout';

export function Home() {
    return (
        <NormalLayout>
            <Alert variant="info">
                Event Viewer
            </Alert>
        </NormalLayout>
    );
}
