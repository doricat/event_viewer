import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

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

const ApplicationManagingMenu = ({ applications = [] }) => {
    return (
        <ListGroup>
            {applications.map((x) => {
                return (
                    <MenuLink to={`/application/${x.id}`}
                        label={x.name}
                        activeOnlyWhenExact={true}
                        key={x.id.toString()}
                    />
                );
            })}
        </ListGroup>
    );
};

export default ApplicationManagingMenu;