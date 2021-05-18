import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Modal, Alert } from 'react-bootstrap';
import { MyContext } from '../../configureStore';

export const ErrorModal = observer(() => {
    const context = useContext(MyContext);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState<string>();
    const length = context.error.exceptionMessage.length;

    useEffect(() => {
        const error = context.error.exceptionMessage.shift();
        if (error && error.isJsonResult) {
            setMessage(error.getMessage());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [length]);

    const hide = () => {
        setShow(false);
        setMessage(undefined);
    };

    return (
        <Modal show={show} size="lg" backdrop="static" onHide={hide}>
            <Alert variant="danger" dismissible>
                <Alert.Heading>服务器引发了一个异常!</Alert.Heading>
                <p>{message}</p>
            </Alert>
        </Modal>
    );
});
