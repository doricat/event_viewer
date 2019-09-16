import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            email: "",
            password: "",
            confirmPassword: "",
            errors: {
                email: "",
                password: "",
                confirmPassword: ""
            }
        };
    }

    handleChange(key, value) {
        let obj = {};
        obj[key] = value;
        this.setState(obj);

        let errors = { ...this.state.errors };
        switch (key) {
            case "email":
                if (value === "") {
                    errors.email = "请输入电子邮件";
                } else {
                    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                        errors.email = "请输入正确的电子邮件地址";
                    } else {
                        errors.email = "";
                    }
                }
                break;

            case "password":
                if (value === "") {
                    errors.password = "请输入密码";
                } else {
                    if (value.length < 6) {
                        errors.password = "密码长度不得小于6个字符";
                    } else if (value.length > 16) {
                        errors.password = "密码长度不得大于16个字符";
                    } else {
                        errors.password = "";
                    }

                    if (this.state.confirmPassword !== "" && this.state.confirmPassword !== value) {
                        errors.confirmPassword = "两次输入的密码不匹配";
                    } else {
                        errors.confirmPassword = "";
                    }
                }
                break;

            case "confirmPassword":
                if (value === "") {
                    errors.confirmPassword = "请再次输入密码";
                } else {
                    if (this.state.password !== value) {
                        errors.confirmPassword = "两次输入的密码不匹配";
                    } else {
                        errors.confirmPassword = "";
                    }
                }
                break;

            default:
                break;
        }
        this.setState({ errors: errors });
    }

    handleSubmit(event) {
        event.preventDefault();

        let flag = false;
        let errors = { ...this.state.errors };
        const { email, password, confirmPassword } = this.state;
        if (email.trim() === "") {
            errors.email = "请输入电子邮件";
            flag = true;
        }

        if (password.trim() === "") {
            errors.password = "请输入密码";
            flag = true;
        } else {
            errors.password = "";
        }

        if (confirmPassword.trim() === "") {
            errors.confirmPassword = "请再次输入密码";
            flag = true;
        }

        this.setState({ errors: errors });

        if (flag === true) {
            return;
        }

        this.setState({ isSubmitting: true });
    }

    validate() {

    }

    render() {
        return (
            <Form noValidate className="needs-validation" onSubmit={(x) => this.handleSubmit(x)}>
                <h4>创建一个新账户</h4>
                <hr />
                {/* <Alert variant="success">message</Alert> */}
                <Form.Group>
                    <Form.Label>电子邮件</Form.Label>
                    <Form.Control isInvalid={this.state.errors.email !== ""} type="email" disabled={this.state.isSubmitting} value={this.state.email} onChange={(x) => this.handleChange("email", x.target.value)} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.password !== ""} type="password" disabled={this.state.isSubmitting} value={this.state.password} onChange={(x) => this.handleChange("password", x.target.value)} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>确认密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.confirmPassword !== ""} type="password" disabled={this.state.isSubmitting} value={this.state.confirmPassword} onChange={(x) => this.handleChange("confirmPassword", x.target.value)} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary" disabled={this.state.isSubmitting}>注册</Button>
                </Form.Group>
            </Form>
        );
    }
}

export default RegisterForm;