import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';
import { ApplicationListGroupContainer } from '../shared/ApplicationListGroupContainer';
import { ApplicationListGroup } from './ApplicationListGroup';
import { StoreContext } from '../../stores';
import { EventHelper } from './Helper';
import { Redirect } from 'react-router';
import { Loading } from '../Loading';

interface Props {
    location: Location;
    path: string;
    component: (props: { applicationId: number; }) => JSX.Element;
}

export const Layout = observer((props: Props) => {
    const context = useContext(StoreContext);
    const params = new URLSearchParams(props.location.search);
    const applicationId = Number(params.get('application') ?? '-1');
    let elem: JSX.Element;
    if (applicationId === -1) {
        elem = (<EventHelper />);
    } else {
        if (context.application.applications == null) {
            elem = (<Loading />);
        } else {
            const index = context.application.applications.findIndex(x => x.id === applicationId);
            elem = index !== -1 ? React.createElement(props.component, { applicationId }) : (<Redirect to="404" />);
        }
    }

    return (
        <Row>
            <Col md={3}>
                <ApplicationListGroupContainer path={props.path} component={ApplicationListGroup} />
            </Col>
            <Col md={9}>
                {elem}
            </Col>
        </Row>
    );
});
