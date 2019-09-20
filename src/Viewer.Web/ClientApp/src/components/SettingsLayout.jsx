import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SettingsMenu from './SettingsMenu';

class SettingsLayout extends React.Component {
    render() {
        return (
            <Row>
                <Col md={3}>
                    <SettingsMenu />
                </Col>
                <Col md={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

export default SettingsLayout;