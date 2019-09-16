import React from 'react';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

class LoginMenu extends React.Component {

    render() {
        const { isAuthenticated, username } = this.props;

        let menu;
        if (isAuthenticated === true) {
            menu = (
                <NavDropdown alignRight title={username}>
                    <Link className="dropdown-item" to={"/profile"}>个人资料</Link>
                    <Link className="dropdown-item" to={"/settings"}>设置</Link>
                    <NavDropdown.Divider />
                    <button className="dropdown-item btn" type="button">退出</button>
                </NavDropdown>
            );
        }
        else {
            menu = (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/register"}>注册</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/login"}>登录</Link>
                    </li>
                </>
            );
        }
        return (
            <ul className="navbar-nav">
                {menu}
            </ul >
        );
    }
}

export default LoginMenu;