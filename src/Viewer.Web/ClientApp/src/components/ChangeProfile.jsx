import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ChangeProfileForm from './ChangeProfileForm';
import ChangeProfilePicture from './ChangeProfilePicture';
import { actions as userActions } from '../store/user';
import { connect } from 'react-redux';

class ChangeProfile extends React.Component {
    componentDidMount() {
        this.props.reloadProfiles();
    }

    render() {
        return (
            <>
                <h4>更改个人资料.</h4>
                <hr />
                <Row>
                    <Col md={7}>
                        <ChangeProfileForm name={this.props.profiles.name} reloadProfiles={this.props.reloadProfiles} />
                    </Col>
                    <Col md={{ span: 4, offset: 1 }}>
                        <h6>个人资料照片</h6>
                        <ChangeProfilePicture avatar={this.props.profiles.avatar} reloadProfiles={this.props.reloadProfiles} />
                    </Col>
                </Row>
            </>
        );
    }
}

export default connect(state => {
    return { profiles: state.user.current.profiles || { name: "", avatar: "" } };
}, dispatch => {
    return {
        reloadProfiles: () => dispatch(userActions.fetchLoadCurrentProfiles())
    };
})(ChangeProfile);