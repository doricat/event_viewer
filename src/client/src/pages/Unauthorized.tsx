import React from 'react';
import { Alert } from 'react-bootstrap';
import { NormalLayout } from '../components/shared/NormalLayout';

export function Unauthorized() {
    return (
        <NormalLayout>
            <Alert variant="info">
                你不具备访问该模块的权限
            </Alert>
        </NormalLayout>
    );
}
