import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ApplicationListGroupContainer } from './ApplicationListGroupContainer';

interface Props {
    children: React.ReactNode
}

export function Layout(props: Props) {
    return (
        <Row>
            <Col md={3}>
                <ApplicationListGroupContainer />
            </Col>
            <Col md={9}>
                {props.children}
            </Col>
        </Row>
    );
}
