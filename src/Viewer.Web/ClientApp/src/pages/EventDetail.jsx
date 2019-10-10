import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import EventNavMenu from '../components/EventNavMenu';
import EventHelper from '../components/EventHelper';
import { actions as applicationActions } from '../store/application';
import EventDetailPanel from '../components/EventDetailPanel';

class EventDetail extends React.Component {
    render() {
        const params = new URLSearchParams(this.props.location.search);
        const appId = params.get("application");
        const level = params.get("level") || "All";
        const state = this.props.location.state;

        const content = appId && level
            ? <EventDetailPanel appId={appId} level={level} key={appId} {...state} />
            : <EventHelper />;

        return (
            <Row>
                <Col md={3}>
                    <EventNavMenu
                        pathname="/event/detail"
                        applications={this.props.applications}
                        load={(callback) => this.props.loadApplications(callback)} />
                </Col>
                <Col md={9}>
                    {content}
                </Col>
            </Row>
        );
    }
}

export default connect(state => {
    return {
        applications: state.application.list
    };
}, dispatch => {
    return {
        loadApplications: (callback) => dispatch(applicationActions.fetchGetApplications(callback))
    };
})(EventDetail);