import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

const MenuLink = ({ label, to, activeOnlyWhenExact }) => (
    <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
            <Link to={to}
                className={match
                    ? "list-group-item list-group-item-action active"
                    : "list-group-item list-group-item-action"}>{label}</Link>
        )}
    />
);

export default () => (
    <ListGroup>
        <ListGroup.Item disabled as="a">设置</ListGroup.Item>
        <MenuLink to="/settings/profile" label="个人资料" activeOnlyWhenExact={true} />
        <MenuLink to="/settings/security" label="安全" activeOnlyWhenExact={true} />
    </ListGroup>
);