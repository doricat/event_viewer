import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, CardColumns } from 'react-bootstrap';
import { Application } from '../../models/entity/application';
import { User } from '../../models/entity/account';
import { SubscriberCard } from './SubscriberCard';
import { toJS } from 'mobx';
import { MyContext } from '../../configureStore';

interface Props {
    application: Application;
    users: User[];
}

export const SubscriberSelector = observer((props: Props) => {
    const context = useContext(MyContext);
    const [traceId, setTraceId] = useState(-1);
    const [selected, setSelected] = useState<number[]>(() => [...props.application.subscribers.slice()]);

    const handleSelect = (id: number) => {
        const index = selected.findIndex(x => x === id);
        if (index !== -1) {
            selected.splice(index, 1)
            setSelected([...selected]);
        } else {
            setSelected([...selected, id]);
        }
    };

    const save = () => {
        setTraceId(context.application.saveSubscribers(props.application.id, selected))
    };

    const requestState = context.ui.requestStates.get(traceId);
    const users = toJS(props.users);

    return (
        <>
            <CardColumns style={{ columnCount: 5 }}>
                {users.map(user => (
                    <SubscriberCard
                        user={user}
                        selected={selected.some(x => x === user.id)}
                        select={handleSelect}
                        submitting={requestState?.waiting}
                        key={user.id.toString()} />
                ))}
            </CardColumns>

            <br />
            <Button variant="primary" className="mr-3" disabled={requestState?.waiting} onClick={save}>保存</Button>
            <Button variant="secondary" disabled={requestState?.waiting} onClick={() => context.router.goBack()}>放弃</Button>
        </>
    );
});
