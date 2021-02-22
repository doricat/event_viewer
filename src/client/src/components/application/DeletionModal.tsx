import React, { useContext, useState, useMemo } from 'react';
import { observer } from 'mobx-react';
import { Modal, Button } from 'react-bootstrap';
import { StoreContext } from '../../stores';
import { ApiResultAlert } from '../ApiResultAlert';

interface Props {
    applicationId: number;
    modal: boolean;
    toggle: () => void;
}

export const DeletionModal = observer((props: Props) => {
    const context = useContext(StoreContext);
    const [traceId, setTraceId] = useState(-1);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('操作成功。');

    const save = () => {
        setShow(false);
        setTraceId(context.application.deleteApplication(props.applicationId));
    };

    const toggle = () => {
        setShow(!show);
    };

    const requestState = context.ui.requestStates.get(traceId);
    useMemo(() => {
        if (requestState?.completed) {
            setShow(true);
        }

        if (requestState?.failed) {
            const error = context.error.operationFailedMessage.get(traceId);
            setMessage(error?.getMessage() ?? '操作失败。');
        }

        if (requestState?.success) {
            setTimeout(() => {
                context.router.push(`/application`);
            }, 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestState?.state]);

    const disabled = requestState?.waiting || requestState?.success;

    return (
        <Modal show={props.modal} onHide={props.toggle} disabled={disabled} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>提示</Modal.Title>
            </Modal.Header>
            <ApiResultAlert show={show} toggle={toggle} success={requestState?.success === true} message={message} />
            <Modal.Body>该操作将删除当前应用程序的所有事件!</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" disabled={disabled} onClick={save}>保存</Button>
                <Button variant="secondary" disabled={disabled} onClick={props.toggle}>放弃</Button>
            </Modal.Footer>
        </Modal>
    );
});
