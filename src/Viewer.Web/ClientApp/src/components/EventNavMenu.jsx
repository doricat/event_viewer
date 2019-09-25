import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import { loading } from './Loading';

const MenuLink = ({ label, to, activeOnlyWhenExact, onClick }) => {
    const pathname = typeof to === "object" ? to.pathname : to;
    return (
        <Route
            path={pathname}
            exact={activeOnlyWhenExact}
            children={({ location }) => {
                return <Link to={to}
                    onClick={onClick}
                    className={new URLSearchParams(location.search).get("application") === new URLSearchParams(to.search).get("application")
                        ? "list-group-item list-group-item-action active"
                        : "list-group-item list-group-item-action"}>{label}</Link>;
            }}
        />
    );
};

export const EventNavMenu = ({ applications = [], onClick, pathname }) => {
    return (
        <ListGroup>
            {applications.map((x) => {
                return (
                    <MenuLink to={{ pathname: pathname, search: `?application=${x.id}`, state: {} }}
                        label={x.name}
                        activeOnlyWhenExact={false}
                        key={x.id.toString()}
                        onClick={() => onClick(x.id)}
                    />
                );
            })}
        </ListGroup>
    );
};

export default loading(EventNavMenu, () => {
    return <Alert variant="info"><i>加载中...</i></Alert>;
});