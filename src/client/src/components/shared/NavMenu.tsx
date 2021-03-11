import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { LoginMenu } from './LoginMenu';

const MenuLink = (props: { label: string, to: string, exact?: boolean }) => (
    <Route
        path={props.to}
        exact={props.exact}
        children={(x) => (
            <Nav.Link to={props.to} as={Link}
                active={x.match != null && (props.exact === true ? x.match.isExact : true)}>{props.label}</Nav.Link>
        )}
    />
);

export function NavMenu() {
    return (
        <Navbar bg="light" expand="lg" fixed="top">
            <Navbar.Brand to="/" as={Link}>Event Viewer</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <MenuLink to={'/'} exact={true} label={'Home'} />
                    <MenuLink to={'/event'} label={'Event'} />
                    <MenuLink to={'/monitor'} label={'Monitor'} />
                    <MenuLink to={'/application'} label={'Application'} />
                </Nav>
                <LoginMenu />
            </Navbar.Collapse>
        </Navbar>
    );
}
