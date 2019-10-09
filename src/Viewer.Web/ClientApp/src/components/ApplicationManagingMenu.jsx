import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import { loading } from './Loading';

const MenuLink = ({ label, to, activeOnlyWhenExact }) => {
    const pathname = typeof to === "object" ? to.pathname : to;
    return (
        <Route
            path={pathname}
            exact={activeOnlyWhenExact}
            children={({ match }) => {
                return <Link to={to}
                    className={match
                        ? "list-group-item list-group-item-action active"
                        : "list-group-item list-group-item-action"}>{label}</Link>;
            }}
        />
    );
};

export const ApplicationManagingMenu = ({ applications = [] }) => {
    return (
        <ListGroup>
            {applications.map((x) => {
                return (
                    <MenuLink to={{ pathname: `/application/${x.id}`, state: {} }}
                        label={x.name}
                        activeOnlyWhenExact={false}
                        key={x.id.toString()}
                    />
                );
            })}
        </ListGroup>
    );
};

export default loading(ApplicationManagingMenu, () => {
    return <Alert variant="info"><i>加载中...</i></Alert>;
});