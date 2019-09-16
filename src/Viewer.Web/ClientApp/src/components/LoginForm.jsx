import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            validated: false,
            email: "",
            password: "",
            rememberMe: false,
            apiResult: {
                message: "test"
            },
            errors: {
                email: "",
                password: ""
            }
        };
    }

    handleChange(key, value) {
        let obj = {};
        obj[key] = value;
        this.setState(obj);
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();

            let errors = { ...this.state.errors };
            if (this.state.email.trim() === "") {
                errors.email = "请输入电子邮件";
            }

            if (this.state.password.trim() === "") {
                errors.password = "请输入密码";
            }

            this.setState({ errors: errors, validated: true });
        } else {
            this.setState({ isSubmitting: true, validated: false });
        }
    }

    render() {
        return (
            <Form noValidate className="needs-validation" onSubmit={(x) => this.handleSubmit(x)}>
                <h4>使用本地账户登录</h4>
                <hr />
                {/* <Alert variant="success">message</Alert> */}
                <Form.Group>
                    <Form.Label>电子邮件</Form.Label>
                    <Form.Control isInvalid={this.state.errors.email !== ""} required type="email" disabled={this.state.isSubmitting} onChange={(x) => this.handleChange("email", x.target.value)} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.password !== ""} required type="password" disabled={this.state.isSubmitting} onChange={(x) => this.handleChange("password", x.target.value)} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group >
                    <Form.Check type="checkbox" label="记住我" disabled={this.state.isSubmitting} onChange={(x) => this.handleChange("rememberMe", x.target.checked)} />
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary" disabled={this.state.isSubmitting}>登录</Button>
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