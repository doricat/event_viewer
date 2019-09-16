import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ChangePasswordForm from './ChangePasswordForm';

export default () => (
    <>
        <h4>更改密码.</h4>
        <hr />
        <Row>
            <Col md={7}>
                <ChangePasswordForm />
            </Col>
        </Row>
    </>
);