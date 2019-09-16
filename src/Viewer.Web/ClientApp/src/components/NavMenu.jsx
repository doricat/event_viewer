import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import LoginMenu from './LoginMenu';

const MenuLink = ({ label, to, activeOnlyWhenExact }) => (
    <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
            <li className={match
                ? "nav-item active"
                : "nav-item"}>
                <Link to={to} className="nav-link">{label}</Link>
            </li>
        )}
    />
);

export default ({ fixed }) => {
    let navCss = "d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow";
    if (fixed && fixed === true) {
        navCss += " fixed-top";
    }

    return (
        <Navbar className={navCss}>
            <h5 className="my-0 mr-md-auto font-weight-normal">
                <Link className="navbar-brand" to={"/"}>事件查看器</Link>
            </h5>
            <Nav>
                <MenuLink to={"/event"} label={"事件"} />
                <MenuLink to={"/monitor"} label={"监视器"} />
                <MenuLink to={"/application"} label={"应用程序"} />
            </Nav>
            <LoginMenu isAuthenticated={false} />
        </Navbar>
    );
};