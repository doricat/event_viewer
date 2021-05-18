import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { NavDropdown, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ApplicationPaths } from '../../infrastructure/apiAuthorizationConstants';
import { MyContext } from '../../configureStore';

export const LoginMenu = observer(() => {
    const context = useContext(MyContext);
    const isAuthenticated = context.account.isAuthenticated;
    const name = context.account.profile.name;

    const loadSettings = () => {
        context.account.loadOidcSettings();
    };

    useEffect(() => {
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        context.account.loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    if (isAuthenticated) {
        return (
            <NavDropdown alignRight title={name} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/account/profile">个人资料</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/account/settings/profile">设置</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to={ApplicationPaths.LogOut}>退出</NavDropdown.Item>
            </NavDropdown>
        );
    }

    return (
        <Nav>
            <Nav.Link as={Link} to={ApplicationPaths.Register}>注册</Nav.Link>
            <Nav.Link as={Link} to={ApplicationPaths.Login}>登录</Nav.Link>
        </Nav>
    );
});
