import React from 'react'
import { Container } from 'react-bootstrap'
import NavMenu from './NavMenu'

export default (props) => {
    return (
        <>
            <NavMenu />
            <Container>
                {props.children}
            </Container>
        </>
    );
};