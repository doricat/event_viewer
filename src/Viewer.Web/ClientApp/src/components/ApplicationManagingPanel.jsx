import React from 'react';
import { Card, ListGroup, ListGroupItem, Modal, Button } from 'react-bootstrap';

class ApplicationManagingPanel extends React.Component {
    render() {
        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>123</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">123</Card.Subtitle>
                    <Card.Text>123</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>事件数：0</ListGroupItem>
                    <ListGroupItem>订阅者：</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    {/* <Link to={{ pathname: match.url, search: "?op=edit" }} className="btn btn-primary card-link">编辑应用</Link>
                <Link to={{ pathname: match.url, search: "?op=manage_subscriber" }} className="btn btn-primary card-link">成员管理</Link> */}
                    <Button variant="warning" className="card-link">删除应用</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default ApplicationManagingPanel;