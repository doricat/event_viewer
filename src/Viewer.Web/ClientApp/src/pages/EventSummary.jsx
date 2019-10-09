import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import EventNavMenu from '../components/EventNavMenu';
import EventHelper from '../components/EventHelper';
import { actions as applicationActions } from '../store/application';
import EventSummaryPanel from '../components/EventSummaryPanel';

class EventSummary extends React.Component {
    render() {
        const params = new URLSearchParams(this.props.location.search);
        const appId = params.get("application");
        const content = appId ? <EventSummaryPanel appId={appId} key={appId.toString()} /> : <EventHelper />;

        return (
            <Row>
                <Col md={3}>
                    <EventNavMenu
                        pathname="/event/summary"
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
})(EventSummary);