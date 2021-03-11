import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Card, ListGroup, ListGroupItem, Button, } from 'react-bootstrap';
import { Application } from '../../models/entity/application';
import { Link } from 'react-router-dom';
import { DeletionModal } from './DeletionModal';

interface Props {
    application: Application;
}

export const ManagementPanel = observer((props: Props) => {
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    const style: { bg?: string, border?: string } = {};
    if (props.application.enabled) {
        style.bg = "light";
    } else {
        style.border = "warning";
    }

    const application = props.application;

    return (
        <>
            <Card {...style}>
                <Card.Body>
                    <Card.Title>{application.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{application.applicationId}</Card.Subtitle>
                    <Card.Text>{application.description}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>事件数：{application.events}</ListGroupItem>
                    <ListGroupItem>关联的用户：{application.subscribers.length}</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    <Link to={`/event/summary?application=${application.id}`} className="btn btn-primary card-link">事件查看</Link>
                    <Link to={`/application/${application.id}/edit`} className="btn btn-primary card-link">编辑应用</Link>
                    <Link to={`/application/${application.id}/subscribers`} className="btn btn-primary card-link">成员管理</Link>
                    <Button variant="warning" className="card-link" onClick={() => setModal(true)}>删除应用</Button>
                </Card.Body>
            </Card>

            <DeletionModal applicationId={application.id} modal={modal} toggle={toggle} />
        </>
    );
});
