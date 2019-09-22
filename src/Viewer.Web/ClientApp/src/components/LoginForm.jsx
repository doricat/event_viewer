import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authorizeService from '../services/AuthorizeService';
import { required, validate } from '../services/validators';

const descriptor = {
    email: {
        displayName: "电子邮件地址",
        validators: [
            (value) => required(value, descriptor.email.displayName)
        ]
    },
    password: {
        displayName: "密码",
        validators: [
            (value) => required(value, descriptor.password.displayName)
        ]
    }
};

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            email: "",
            password: "",
            rememberMe: false,
            apiResult: null,
            invalid: {
                email: false,
                password: false
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

        const { email, password } = this.state;
        const model = { email, password };
        const result = validate(model, descriptor);

        if (result.hasError) {
            let invalid = { ...this.state.invalid };
            if (result.hasOwnProperty("email")) {
                invalid.email = true;
            }
            if (result.hasOwnProperty("password")) {
                invalid.password = true;
            }
            this.setState({ invalid: invalid });
            return;
        }

        this.setState({ isSubmitting: true, apiResult: null });

        authorizeService.signIn({
            username: this.state.email,
            password: this.state.password,
            rememberMe: this.state.rememberMe
        }).then(result => {
            this.setState({ isSubmitting: false });
            if (result.succeeded === true) {
                this.props.navigate();
            } else {
                const { code, message } = result;
                this.setState({
                    apiResult: {
                        code,
                        message
                    },
                    password: ""
                });
            }
        });
    }

    handleValidate(key) {
        const { email, password } = this.state;
        const model = { email, password };
        const result = validate(model, descriptor);

        let invalid = { ...this.state.invalid };
        if (result.hasError && result.hasOwnProperty(key)) {
            invalid[key] = true;
        } else {
            invalid[key] = false;
        }

        this.setState({ invalid: invalid });
    }

    render() {
        return (
            <Form noValidate className="needs-validation" onSubmit={(x) => this.handleSubmit(x)}>
                <h4>使用本地账户登录</h4>
                <hr />
                {
                    this.state.apiResult !== null
                        ?
                        <Alert variant="warning">{this.state.apiResult.message}</Alert>
                        :
                        null
                }
                <Form.Group>
                    <Form.Label>电子邮件</Form.Label>
                    <Form.Control isInvalid={this.state.invalid.email} type="email"
                        disabled={this.state.isSubmitting}
                        onChange={(x) => this.handleChange("email", x.target.value)}
                        value={this.state.email}
                        onBlur={() => this.handleValidate("email")}
                        autoComplete="off" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>密码</Form.Label>
                    <Form.Control isInvalid={this.state.invalid.password} type="password"
                        disabled={this.state.isSubmitting}
                        onChange={(x) => this.handleChange("password", x.target.value)}
                        value={this.state.password}
                        onBlur={() => this.handleValidate("password")} />
                </Form.Group>

                <Form.Group >
                    <Form.Check type="checkbox" label="记住我"
                        disabled={this.state.isSubmitting}
                        onChange={(x) => this.handleChange("rememberMe", x.target.checked)} />
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary" disabled={this.state.isSubmitting}>登录</Button>
                </Form.Group>

                <Form.Group >
                    <p>
                        <Link to={"/account/register"}>注册新用户</Link>
                    </p>
                </Form.Group>

            </Form>
        );
    }
}

export default LoginForm;