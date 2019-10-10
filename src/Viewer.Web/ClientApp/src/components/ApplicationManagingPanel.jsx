import React from 'react';
import { Card, ListGroup, ListGroupItem, Modal, Button, Alert } from 'react-bootstrap';
import { loading } from './Loading';
import { Link } from 'react-router-dom';
import authorizeService from '../services/AuthorizeService';
import { push } from 'connected-react-router';
import { actions as uiActions } from '../store/ui';
import { connect } from 'react-redux';
import ApiResultAlert from './ApiResultAlert';

export class ApplicationManagingPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            show: false,
            apiResult: null,
            localSuccessMessage: undefined
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

    async save() {
        const token = await authorizeService.getAccessToken();
        const response = await fetch(`/api/applications/${this.props.application.id}`, {
            method: "DELETE",
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.status >= 400 && response.status < 500) {
                this.setState({ apiResult: json });
                return;
            }

            if (response.status === 500) {
                this.props.setGlobalError(json.error.message);
                return;
            }

            console.error(json);
        } else {
            if (response.ok === true) {
                this.setState({ localSuccessMessage: "操作成功！" });
                setTimeout(() => {
                    this.props.redirectToApplication()
                }, 1000);
                return;
            }

            if (response.status === 401) {
                authorizeService.signOut();
                this.props.redirectToLogin();
            }

            if (response.status === 403) {
                authorizeService.signOut();
                this.props.redirectToLogin();
            }
        }
    }

    render() {
        const application = this.props.application;

        if (application) {

            const { isSubmitting } = this.state;

            const style = {};
            if (application.enabled) {
                style.bg = "light";
            } else {
                style.border = "warning";
            }

            return (
                <>
                    <Card {...style}>
                        <Card.Body>
                            <Card.Title>{application.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{application.appId}</Card.Subtitle>
                            <Card.Text>{application.description}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>事件数：{application.eventCount}</ListGroupItem>
                            <ListGroupItem>关联的用户：{application.userList.length}</ListGroupItem>
                        </ListGroup>
                        <Card.Body>
                            <Link to={{ pathname: `/application/${application.id}/edit`, state: { fromPanel: true } }} className="btn btn-primary card-link">编辑应用</Link>
                            <Link to={{ pathname: `/application/${application.id}/subscribers`, state: { fromPanel: true } }} className="btn btn-primary card-link">成员管理</Link>
                            <Button variant="warning" className="card-link" onClick={() => this.handleShow()}>删除应用</Button>
                        </Card.Body>
                    </Card>

                    <Modal show={this.state.show} onHide={() => this.handleClose()} disabled={isSubmitting}>
                        <Modal.Header closeButton>
                            <Modal.Title>提示</Modal.Title>
                        </Modal.Header>
                        <ApiResultAlert message={this.state.localSuccessMessage} apiResult={this.state.apiResult} />
                        <Modal.Body>该操作将删除当前应用程序的所有事件!</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" disabled={isSubmitting} onClick={() => this.handleClose()}>放弃</Button>
                            <Button variant="danger" disabled={isSubmitting} onClick={() => this.save()}>保存</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            );
        }

        return null;
    }
}

export default loading(connect(null, dispatch => {
    return {
        redirectToApplication: () => dispatch(push("/application")), // TODO remove form list
        redirectToLogin: () => dispatch(push("/account/login")),
        setGlobalError: (message) => dispatch(uiActions.setGlobalError(true, message))
    }
})(ApplicationManagingPanel), () =>
    (
        <Alert variant="info"><i>加载中...</i></Alert>
    )
);