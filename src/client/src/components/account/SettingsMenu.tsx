import React from 'react';
import { Route, Link } from 'react-router-dom';

const MenuLink = (props: {
    label: string;
    to: string;
}) => (
    <Route
        path={props.to}
        exact={true}
        children={({ match }) => (
            <Link to={props.to}
                className={match
                    ? "list-group-item list-group-item-action active"
                    : "list-group-item list-group-item-action"}>{props.label}</Link>
        )}
    />
);

export function SettingsMenu() {
    return (
        <div className="list-group">
            <a href="/" className="list-group-item list-group-item-action disabled">设置</a>
            <MenuLink to={'/account/settings/profile'} label={'个人资料'} />
            <MenuLink to={'/account/settings/security'} label={'安全'} />
        </div>
    );
}
