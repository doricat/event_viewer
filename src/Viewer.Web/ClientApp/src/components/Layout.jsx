import React from 'react';
import { Container } from 'react-bootstrap';
import NavMenu from './NavMenu';
import { connect } from 'react-redux';

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
        </>
    );
};

export default connect((state) => {
    return {
        navMenuFixed: state.ui.navMenuFixed
    }
})(Layout);