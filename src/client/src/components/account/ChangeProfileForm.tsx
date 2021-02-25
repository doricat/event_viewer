import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react';
import { Form, Button } from 'react-bootstrap';
import { StoreContext } from '../../stores';
import { NameChangeModel } from '../../models/view/account';

export const ChangeProfileForm = observer(() => {
    const context = useContext(StoreContext);
    const name = context.account.profile.name;
    const [traceId, setTraceId] = useState(-1);
    const [editionModel] = useState(() => new NameChangeModel(name));

    const save = (event: React.FormEvent) => {
        event.preventDefault();
        setTraceId(context.account.changeName(editionModel.name.value));
    };

    const state = context.ui.requestStates.get(traceId);

    return (
        <Form noValidate className="needs-validation" onSubmit={save}>
            <Form.Group>
                <Form.Label>{editionModel.name.displayName}</Form.Label>
                <Form.Control type="text"
                    isInvalid={editionModel.name.invalid}
                    disabled={state?.waiting}
                    value={editionModel.name.value}
                    onChange={(x) => editionModel.name.value = x.target.value}
                    onBlur={() => editionModel.name.validate()} />
                <Form.Control.Feedback type="invalid">{editionModel.name.firstError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Button type="submit" variant="primary" disabled={state?.waiting}>更新</Button>
            </Form.Group>

        </Form>
    );
});
