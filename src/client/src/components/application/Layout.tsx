import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ApplicationListGroupContainer } from '../shared/ApplicationListGroupContainer';
import { ApplicationListGroup } from './ApplicationListGroup';

interface Props {
    children: React.ReactNode
}

export function Layout(props: Props) {
    return (
        <Row>
            <Col md={3}>
                <ApplicationListGroupContainer path={'/application'} component={ApplicationListGroup} />
            </Col>
            <Col md={9}>
                {props.children}
            </Col>
        </Row>
    );
}
