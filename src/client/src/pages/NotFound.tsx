import React from 'react'
import { Alert } from 'react-bootstrap'
import { NormalLayout } from '../components/shared/NormalLayout';

export function NotFound() {
    return (
        <NormalLayout>
            <Alert variant="info">
                你迷路了
            </Alert>
        </NormalLayout>
    );
}
