import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

export default ({ apiResult, message }) => {
    if (!apiResult && !message) {
        return null;
    }

    if (apiResult && apiResult.error) {
        return (<Alert variant="warning">{apiResult.error.message}</Alert>);
    }

    const [show, setShow] = useState(true);
    useEffect(() => {
        let timer = null;
        if (show) {
            timer = setTimeout(() => {
                setShow(false);
            }, 5000);
        } else if (!show) {
            clearTimeout(timer)
        }
        return () => clearTimeout(timer);
    }, [show]);

    if (message || apiResult.value) {
        if (show) {
            return (
                <Alert variant="success" onClose={() => setShow(false)} dismissible>
                    {message || apiResult.value.message}
                </Alert>
            );
        }

        return null;
    }
};