import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';

interface Props {
    show: boolean;
    toggle: () => void;
    success: boolean;
    message: string;
    delay?: number;
}

export function ApiResultAlert(props: Props) {
    const alert = (): number | undefined => {
        let handle: number | undefined;
        if (props.delay !== undefined) {
            handle = window.setTimeout(() => {
                props.toggle();
            }, props.delay);
        }

        return handle;
    };

    useEffect(() => {
        const handle = alert();
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.show, props.message, props.success]);

    if (props.show) {
        const variant = props.success ? 'success' : 'warning';
        return (
            <Alert variant={variant} onClose={() => props.toggle()} dismissible>
                {props.message}
            </Alert>
        );
    }

    return null;
}
