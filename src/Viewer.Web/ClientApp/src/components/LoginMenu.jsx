import React from 'react';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import authorizeService from '../services/AuthorizeService';

class LoginMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            username: null,
            dropdownShow: false
        };
    }

    componentDidMount() {
        this._subscription = authorizeService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authorizeService.unsubscribe(this._subscription);
    }

    populateState() {
        const isAuthenticated = authorizeService.isAuthenticated();
        const user = authorizeService.getUser();
        this.setState({
            isAuthenticated,
            username: user && user.unique_name
        });
    }

    handleToggle(isOpen, _event, _metadata) {
        this.setState({ dropdownShow: isOpen });
    }

    closeDropdown() {
        this.setState({ dropdownShow: false });
    }

    render() {
        const { isAuthenticated, username } = this.state;

        let menu;
        if (isAuthenticated === true) {
            menu = (
                <NavDropdown alignRight title={username} onToggle={(isOpen, event, metadata) => this.handleToggle(isOpen, event, metadata)} show={this.state.dropdownShow}>
                    <Link className="dropdown-item" to={"/profile"} onClick={() => this.closeDropdown()}>个人资料</Link>
                    <Link className="dropdown-item" to={"/settings"} onClick={() => this.closeDropdown()}>设置</Link>
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