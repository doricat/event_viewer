import React from 'react';
import { Container, Modal, Alert } from 'react-bootstrap';
import NavMenu from './NavMenu';
import { connect } from 'react-redux';
import { actions as uiActions } from '../store/ui';
import { actions as userActions } from '../store/user';

class Layout extends React.Component {
    componentDidMount() {
        this.props.loadProfiles();
    }

    render() {
        let obj = {};
        if (this.props.navMenuFixed) {
            obj = {
                fluid: true,
                style: {
                    marginTop: "80px"
                }
            }
        }

        return (
            <>
                <NavMenu fixed={this.props.navMenuFixed} />
                <Container {...obj}>
                    {this.props.children}
                </Container>

                <Modal show={this.props.globalErrorModal.show} size="lg" backdrop="static">
                    <Alert variant="danger" dismissible style={{ marginBottom: "0px" }} onClose={() => this.props.dispatch(uiActions.closeGlobalErrorMessageBox(true))}>
                        <Alert.Heading>服务器引发了一个异常!</Alert.Heading>
                        <p>{this.props.globalErrorModal.message}</p>
                    </Alert>
                </Modal>
            </>
        );
    }
}

export default connect((state) => {
    return {
        navMenuFixed: state.ui.navMenuFixed,
        globalErrorModal: state.ui.globalErrorModal
    }
}, dispatch => {
    return {
        loadProfiles: () => dispatch(userActions.fetchLoadCurrentProfiles())
    }
})(Layout);