import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { SettingsMenu } from './SettingsMenu';

interface Props {
    children: React.ReactNode;
}

export function SettingsLayout(props: Props) {
    return (
        <Row>
            <Col md={3}>
                <SettingsMenu />
            </Col>
            <Col md={9}>
                {props.children}
            </Col>
        </Row>
    );
}