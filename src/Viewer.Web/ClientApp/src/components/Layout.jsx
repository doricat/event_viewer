import React from 'react';
import { Container, Modal, Alert } from 'react-bootstrap';
import NavMenu from './NavMenu';
import { connect } from 'react-redux';
import { actions as uiActions } from '../store/ui';

const Layout = (props) => {
    let obj = {};
    if (props.navMenuFixed) {
        obj = {
            fluid: true,
            style: {
                marginTop: "80px"
            }
        }
    }

    return (
        <>
            <NavMenu fixed={props.navMenuFixed} />
            <Container {...obj}>
                {props.children}
            </Container>

            <Modal show={props.globalErrorModal.show} size="lg" backdrop="static">
                <Alert variant="danger" dismissible style={{ marginBottom: "0px" }} onClose={() => props.dispatch(uiActions.closeGlobalErrorMessageBox(true))}>
                    <Alert.Heading>服务器引发了一个异常!</Alert.Heading>
                    <p>{props.globalErrorModal.message}</p>
                </Alert>
            </Modal>
        </>
    );
};

export default connect((state) => {
    return {
        navMenuFixed: state.ui.navMenuFixed,
        globalErrorModal: state.ui.globalErrorModal
    }
})(Layout);