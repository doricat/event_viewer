import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react';
import { Form, Button } from 'react-bootstrap';
import { StoreContext } from '../../stores';
import { PasswordChangeModel } from '../../models/view/account';

export const ChangePasswordForm = observer(() => {
    const context = useContext(StoreContext);
    const [traceId, setTraceId] = useState(-1);
    const [editionModel] = useState(() => new PasswordChangeModel());

    const save = (event: React.FormEvent) => {
        event.preventDefault();
        setTraceId(context.account.changePassword(editionModel.toApiModel()));
    };

    const state = context.ui.requestStates.get(traceId);

    return (
        <Form noValidate className="needs-validation" onSubmit={save}>
            <Form.Group>
                <Form.Label>{editionModel.currentPassword.displayName}</Form.Label>
                <Form.Control type="password"
                    isInvalid={editionModel.currentPassword.invalid}
                    value={editionModel.currentPassword.value}
                    disabled={state?.waiting}
                    onChange={(x) => editionModel.currentPassword.value = x.target.value}
                    onBlur={() => editionModel.currentPassword.validate()} />
                <Form.Control.Feedback type="invalid">{editionModel.currentPassword.firstError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>{editionModel.password.displayName}</Form.Label>
                <Form.Control type="password"
                    isInvalid={editionModel.password.invalid}
                    value={editionModel.password.value}
                    disabled={state?.waiting}
                    onChange={(x) => editionModel.password.value = x.target.value}
                    onBlur={() => editionModel.password.validate()} />
                <Form.Control.Feedback type="invalid">{editionModel.password.firstError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label>{editionModel.confirmPassword.displayName}</Form.Label>
                <Form.Control type="password"
                    isInvalid={editionModel.confirmPassword.invalid}
                    value={editionModel.confirmPassword.value}
                    disabled={state?.waiting}
                    onChange={(x) => editionModel.confirmPassword.value = x.target.value}
                    onBlur={() => editionModel.confirmPassword.validate()} />
                <Form.Control.Feedback type="invalid">{editionModel.confirmPassword.firstError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group >
                <Button type="submit" variant="primary" disabled={state?.waiting}>更新密码</Button>
            </Form.Group>

        </Form>
    );
});
