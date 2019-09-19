import React from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actions } from '../store/ui';

class Monitor extends React.Component {

    UNSAFE_componentWillMount() {
        const { dispatch } = this.props;
        dispatch(actions.fixNavMenu());
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(actions.unfixNavMenu());
    }

    render() {
        return (
            <Alert variant="info">
                建设中
            </Alert>
        );
    }
}

export default connect()(Monitor);