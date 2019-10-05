import React from 'react';
import { Card, ListGroup, ListGroupItem, Modal, Button, Alert } from 'react-bootstrap';
import { loading } from './Loading';
import { Link } from 'react-router-dom';

export class ApplicationManagingPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            show: false
        };
    }

    setShow(state) {
        this.setState({ show: state });
    }

    handleClose() {
        if (this.state.isSubmitting === false) {
            this.setShow(false);
        }
    }

    handleShow() {
        this.setShow(true)
    }

    save() {
        this.props.removeApp(this.props.detail.id, (state) => {
            this.setShow(state);
            this.props.history.push("/application");
        });
    }

    componentDidMount() {
        const { location, match, loadDetail } = this.props;
        if (location.state === undefined && this.props.loading === false) {
            loadDetail(match.params.id);
        }
    }

    render() {
        const detail = this.props.detail;

        if (detail) {
            const { match } = this.props;
            const { isSubmitting } = this.state;

            let style = {};
            if (detail.enabled) {
                style.bg = "light";
            } else {
                style.border = "warning";
            }

            return (
                <>
                    <Card {...style}>
                        <Card.Body>
                            <Card.Title>{detail.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{detail.appId}</Card.Subtitle>
                            <Card.Text>{detail.description}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>事件数：{detail.eventCount}</ListGroupItem>
                            <ListGroupItem>订阅者：{detail.userList.length}</ListGroupItem>
                        </ListGroup>
                        <Card.Body>
                            <Link to={{ pathname: `/application/${match.params.id}/edit`, state: { fromPanel: true } }} className="btn btn-primary card-link">编辑应用</Link>
                            <Link to={{ pathname: `/application/${match.params.id}/subscribers`, state: { fromPanel: true } }} className="btn btn-primary card-link" onClick={() => this.props.loadUsers()}>成员管理</Link>
                            <Button variant="warning" className="card-link" onClick={() => this.handleShow()}>删除应用</Button>
                        </Card.Body>
                    </Card>

                    <Modal show={this.state.show} onHide={() => this.handleClose()} disabled={isSubmitting}>
                        <Modal.Header closeButton>
                            <Modal.Title>提示</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>该操作将删除当前应用程序的所有事件!</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" disabled={isSubmitting} onClick={() => this.handleClose()}>放弃</Button>
                            <Button variant="danger" disabled={isSubmitting} onClick={() => this.save()}>保存</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            );
        }

        return LoadingAlert();
    }
}

const LoadingAlert = () => (<Alert variant="info"><i>加载中...</i></Alert>);

export default loading(ApplicationManagingPanel, LoadingAlert);