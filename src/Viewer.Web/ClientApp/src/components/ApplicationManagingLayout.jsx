import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ApplicationManagingMenu from '../components/ApplicationManagingMenu';
import { connect } from 'react-redux'
import { actions as applicationActions } from '../store/application'

class ApplicationManagingLayout extends React.Component {

    UNSAFE_componentWillMount() {
        this.props.dispatch(applicationActions.fetchGetApplications());
    }

    render() {
        console.log(this.props);
        return (
            <Row>
                <Col md={3}>
                    <ApplicationManagingMenu loading={this.props.applicationListLoadingState} />
                </Col>
                <Col md={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

export default connect(state => {
    return { applicationListLoadingState: state.ui.applicationListLoadingState };
})(ApplicationManagingLayout);