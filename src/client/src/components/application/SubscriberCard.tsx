import React from 'react';
import { Card } from 'react-bootstrap';
import { User } from '../../models/entity/account';

interface Props {
    user: User;
    selected: boolean;
    select: (id: number) => void;
    submitting?: boolean;
}

export function SubscriberCard(props: Props) {
    const select = () => {
        if (props.submitting) {
            return;
        }

        props.select(props.user.id);
    };

    const { user } = props;
    return (
        <Card style={{ cursor: 'pointer' }}
            onClick={select}
            border={props.selected ? "primary" : "light"}>
            <Card.Img variant="top" src={user.avatar} />
            <Card.Body>
                {user.name}
            </Card.Body>
        </Card>
    );
}
