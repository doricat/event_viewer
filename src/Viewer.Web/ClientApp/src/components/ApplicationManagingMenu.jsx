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
            children={({ match }) => {
                return <Link to={to}
                    onClick={onClick}
                    className={match
                        ? "list-group-item list-group-item-action active"
                        : "list-group-item list-group-item-action"}>{label}</Link>;
            }}
        />
    );
};

export const ApplicationManagingMenu = ({ applications = [], loadDetail }) => {
    return (
        <ListGroup>
            {applications.map((x) => {
                return (
                    <MenuLink to={{ pathname: `/application/${x.id}`, state: { manual: true } }}
                        label={x.name}
                        activeOnlyWhenExact={true}
                        key={x.id.toString()}
                        onClick={() => loadDetail(x.id)}
                    />
                );
            })}
        </ListGroup>
    );
};

export default loading(ApplicationManagingMenu, () => {
    return <Alert variant="info"><i>加载中...</i></Alert>;
});