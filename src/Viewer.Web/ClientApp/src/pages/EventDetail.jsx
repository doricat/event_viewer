import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import EventNavMenu from '../components/EventNavMenu';
import EventHelper from '../components/EventHelper';
import { actions as applicationActions } from '../store/application';
import EventDetailPanel from '../components/EventDetailPanel';

class EventDetail extends React.Component {

    componentDidMount() {
        this.props.dispatch(applicationActions.fetchGetApplications());
    }

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
                        loading={this.props.applicationListLoadingState}
                        applications={this.props.applications}
                        onClick={(id) => this.loadDetail(id)} />
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
        applicationListLoadingState: state.ui.applicationListLoadingState,
        applications: state.application.list
    };
})(EventDetail);