import React from 'react';
import { Alert } from 'react-bootstrap';

export function EventHelper() {
    return (
        <Alert variant="success">
            <Alert.Heading>提示</Alert.Heading>
            <p>请选择一个应用查看</p>
        </Alert>
    );
}
