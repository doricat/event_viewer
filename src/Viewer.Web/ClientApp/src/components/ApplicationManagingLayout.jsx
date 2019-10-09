import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ApplicationManagingMenu from '../components/ApplicationManagingMenu';
import { connect } from 'react-redux'
import { actions as applicationActions } from '../store/application';

class ApplicationManagingLayout extends React.Component {
    render() {
        return (
            <Row>
                <Col md={3}>
                    <ApplicationManagingMenu applications={this.props.applications} load={(callback) => this.props.loadApplications(callback)} />
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
        applications: state.application.list
    };
}, dispatch => {
    return {
        loadApplications: (callback) => dispatch(applicationActions.fetchGetApplications(callback))
    };
})(ApplicationManagingLayout);