import React from 'react';
import { Alert } from 'react-bootstrap';

function Unauthorized() {
    return (
        <Alert variant="info">
            你不具备访问该模块的权限
        </Alert>
    );
}

export { Unauthorized };
