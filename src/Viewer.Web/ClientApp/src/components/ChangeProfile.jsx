import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ChangeProfileForm from './ChangeProfileForm';
import ChangeProfilePicture from './ChangeProfilePicture';

export default () => (
    <>
        <h4>更改个人资料.</h4>
        <hr />
        <Row>
            <Col md={7}>
                <ChangeProfileForm />
            </Col>
            <Col md={{ span: 4, offset: 1 }}>
                <h6>个人资料照片</h6>
                <ChangeProfilePicture />
            </Col>
        </Row>
    </>
);