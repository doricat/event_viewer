import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            controlDisabled: false
        };
    }

    handleChange(key, value) {

    }

    handleClick(evt) {
        evt.preventDefault();
    }

    render() {
        return (
            <Form>
                <h4>使用本地账户登录</h4>
                <hr />
                <Alert variant="success">message</Alert>
                <Form.Group>
                    <Form.Label>电子邮件</Form.Label>
                    <Form.Control type="email" disabled={this.state.controlDisabled} onChange={(x) => this.handleChange("email", x.target.value)} />
                    {/* <Form.Text className="text-muted">{this.state.message}</Form.Text> */}
                </Form.Group>

                <Form.Group>
                    <Form.Label>密码</Form.Label>
                    <Form.Control type="password" disabled={this.state.controlDisabled} onChange={(x) => this.handleChange("password", x.target.value)} />
                    {/* <Form.Text className="text-muted">{this.state.message}</Form.Text> */}
                </Form.Group>

                <Form.Group >
                    <Form.Check type="checkbox" label="记住我" disabled={this.state.controlDisabled} onChange={(x) => this.handleChange("rememberMe", x.target.checked)} />
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary" disabled={this.state.controlDisabled} onClick={(x) => this.handleClick(x)}>登录</Button>
                </Form.Group>

                <Form.Group >
                    <p>
                        <Link to={"/register"}>注册新用户</Link>
                    </p>
                </Form.Group>

            </Form>
        );
    }
}

export default LoginForm;