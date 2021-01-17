import React from 'react';
import { Alert } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

function Home() {
    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>

            <Alert variant="info">
                Event Viewer
            </Alert>
        </>
    );
}

export { Home };