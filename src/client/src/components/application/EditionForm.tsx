import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Form, Button } from 'react-bootstrap';
import { StoreContext } from '../../stores';
import { EditionModel } from '../../models/view/application';
import { ApiResultAlert } from '../ApiResultAlert';
import { Loading } from '../Loading';

interface Props {
    applicationId?: number;
}

export const EditionForm = observer((props: Props) => {
    const context = useContext(StoreContext);
    const [traceId, setTraceId] = useState(-1);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('操作成功。');
    const [editionModel, setEditionModel] = useState<EditionModel>();

    const save = (event: React.FormEvent) => {
        event.preventDefault();

        if (!editionModel?.validate()) {
            return;
        }

        if (props.applicationId !== undefined) {
            setTraceId(context.application.replaceApplication(props.applicationId, editionModel!.toApiModel()));
        } else {
            setTraceId(context.application.createApplication(editionModel!.toApiModel()));
        }
    };

    const toggle = () => {
        setShow(!show);
    };

    useEffect(() => {
        if (props.applicationId !== undefined) {
            setEditionModel(() => new EditionModel(context.application.getApplication(props.applicationId!)));
        } else {
            setEditionModel(() => new EditionModel());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.applicationId]);

    const buttonName = props.applicationId !== undefined ? "保存" : "创建";
    const title = props.applicationId !== undefined ? "编辑一个应用程序" : "创建一个新应用程序";
    const requestState = context.ui.requestStates.get(traceId);

    useEffect(() => {
        if (requestState?.completed) {
            setShow(true);
        }

        if (requestState?.failed) {
            const error = context.error.operationFailedMessage.get(traceId);
            setMessage(error?.getMessage() ?? '操作失败。');

            const validationResult = error?.getServerValidationResult();
            if (validationResult) {
                editionModel?.setApiValidationResult(validationResult);
            }
        }

        if (requestState?.success) {
            // context.router.push(''); BUG: Cannot update during an existing state transition
            setTimeout(() => {
                context.router.push(`/application/${context.application.creationResult?.id}`);
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestState?.state]);

    if (editionModel === undefined) {
        return (<Loading />);
    }

    return (
        <Form noValidate className="needs-validation" onSubmit={save}>
            <h4>{title}</h4>
            <hr />
            <ApiResultAlert show={show}
                toggle={toggle}
                success={requestState?.success === true}
                message={message} />

            <Form.Group>
                <Form.Label>{editionModel.name.displayName}</Form.Label>
                <Form.Control type="text"
                    disabled={requestState?.waiting}
                    isInvalid={editionModel.name.invalid}
                    onChange={(x) => editionModel.name.value = x.target.value}
                    value={editionModel.name.value}
                    onBlur={() => editionModel.name.validate()} />
                <Form.Control.Feedback type="invalid">{editionModel.name.firstError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>{editionModel.applicationId.displayName}</Form.Label>
                <Form.Control type="text"
                    disabled={requestState?.waiting}
                    isInvalid={editionModel.applicationId.invalid}
                    onChange={(x) => editionModel.applicationId.value = x.target.value}
                    value={editionModel.applicationId.value}
                    onBlur={() => editionModel.applicationId.validate()} />
                <Form.Control.Feedback type="invalid">{editionModel.applicationId.firstError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>{editionModel.description.displayName}</Form.Label>
                <Form.Control as="textarea" rows={3}
                    disabled={requestState?.waiting}
                    isInvalid={editionModel.description.invalid}
                    onChange={(x) => editionModel.description.value = x.target.value}
                    value={editionModel.description.value}
                    onBlur={() => editionModel.description.validate()} />
                <Form.Control.Feedback type="invalid">{editionModel.description.firstError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Check type="checkbox" label="启用状态"
                    disabled={requestState?.waiting}
                    onChange={(x) => editionModel.enabled = x.target.checked}
                    checked={editionModel.enabled} />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={requestState?.waiting} className="mr-3">{buttonName}</Button>
            <Button variant="secondary" type="button" disabled={requestState?.waiting} onClick={() => context.router.goBack()}>取消</Button>
        </Form>
    );
});
