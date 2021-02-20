import React from 'react';
import { Alert, Button } from 'react-bootstrap';

interface Props {
    message?: string;
    retry?: () => void;
}

export function LoadFailed(props: Props) {
    const retry = props.retry !== undefined
        ? (
            <>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={() => props.retry!()}>重试</Button>
                </div>
            </>
        )
        : null;

    return (
        <Alert variant="warning">
            <Alert.Heading>加载失败！</Alert.Heading>
            <p>{props.message}</p>
            {retry}
        </Alert>
    );
}
