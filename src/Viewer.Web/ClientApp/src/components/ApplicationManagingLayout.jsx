import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ApplicationManagingMenu from '../components/ApplicationManagingMenu';
import { connect } from 'react-redux'
import { actions as applicationActions } from '../store/application';

class ApplicationManagingLayout extends React.Component {

    loadDetail(id) {
        this.props.dispatch(applicationActions.fetchLoadApplicationDetail(id, true));
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(applicationActions.fetchGetApplications());
    }

    render() {
        return (
            <Row>
                <Col md={3}>
                    <ApplicationManagingMenu loading={this.props.applicationListLoadingState} applications={this.props.applications} loadDetail={id => this.loadDetail(id)} />
                </Col>
                <Col md={9}>
                    {this.props.children}
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
})(ApplicationManagingLayout);