import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ApplicationManagingMenu from '../components/ApplicationManagingMenu';

class ApplicationManagingLayout extends React.Component {

    render() {
        return (
            <Row>
                <Col md={3}>
                    <ApplicationManagingMenu />
                </Col>
                <Col md={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

export default ApplicationManagingLayout;