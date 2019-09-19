import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { required, regexExpression, maxLength, stringLength, compare } from '../services/validators';

const descriptor = {
    email: {
        displayName: "电子邮件地址",
        validators: [
            (value) => required(value, descriptor.email.displayName),
            (value) => regexExpression(value, "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", descriptor.email.displayName),
            (value) => maxLength(value, descriptor.email.displayName)
        ]
    },
    password: {
        displayName: "密码",
        validators: [
            (value) => required(value, descriptor.password.displayName),
            (value) => stringLength(value, 6, 16, descriptor.password.displayName)
        ]
    },
    confirmPassword: {
        displayName: "确认密码",
        validators: [
            (value) => required(value, descriptor.confirmPassword.displayName),
            (value, valueObj) => compare(value, "password", valueObj, descriptor.confirmPassword.displayName, descriptor)
        ]
    }
};

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            email: "",
            password: "",
            confirmPassword: "",
            apiResult: null,
            errors: {
                email: null,
                password: null,
                confirmPassword: null
            }
        };
    }

    handleChange(key, value) {
        let obj = {};
        obj[key] = value;

        let errors = { ...this.state.errors };

        for (const prop in descriptor[key].validators) {
            if (descriptor[key].validators.hasOwnProperty(prop)) {
                const validator = descriptor[key].validators[prop];
                var result = validator(value, this.state);
                if (!result.succeeded) {
                    errors[key] = result.message;
                    break;
                }

                errors[key] = null;
            }
        }

        obj.errors = errors;
        this.setState(obj);
    }

    handleSubmit(event) {
        event.preventDefault();

        let hasError = false;
        let errors = { ...this.state.errors };
        const { email, password, confirmPassword } = this.state;
        const model = { email, password, confirmPassword };
        for (const key in model) {
            if (model.hasOwnProperty(key)) {
                const value = model[key];

                for (const prop in descriptor[key].validators) {
                    if (descriptor[key].validators.hasOwnProperty(prop)) {
                        const validator = descriptor[key].validators[prop];
                        var result = validator(value, model);
                        if (!result.succeeded) {
                            errors[key] = result.message;
                            hasError = true;
                            break;
                        }

                        errors[key] = null;
                    }
                }
            }
        }

        if (hasError) {
            this.setState({ errors: errors });
            return;
        }

        this.setState({ isSubmitting: true, apiResult: null });
        this.fetchRegister(model);
    }

    async fetchRegister(model) {
        const response = await fetch("/api/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(model)
        });

        const json = await response.json();
        // return response.ok === true ? { succeeded: true } : { succeeded: false, ...json.error };
        this.setState({ isSubmitting: false });

        if (response.ok === true) {
            this.props.navigate();
        } else {
            const { code, message, details } = json.error;
            let errors = { ...this.state.errors };
            for (let i = 0; i < details.length; i++) {
                const detail = details[i];
                // {
                //  "code": "",
                //  "message": "",
                //  "target": ""
                // }
                if (detail.target && errors.hasOwnProperty(detail.target)) {
                    errors[detail.target] = detail.message;
                }
            }

            this.setState({
                apiResult: {
                    code,
                    message
                },
                errors: errors
            });
        }
    }

    render() {
        return (
            <Form noValidate className="needs-validation" onSubmit={(x) => this.handleSubmit(x)}>
                <h4>创建一个新账户</h4>
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
                    <Form.Control isInvalid={this.state.errors.email} type="email" disabled={this.state.isSubmitting} value={this.state.email} onChange={(x) => this.handleChange("email", x.target.value)} autoComplete="off" />
                    <Form.Control.Feedback type="invalid">{this.state.errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.password} type="password" disabled={this.state.isSubmitting} value={this.state.password} onChange={(x) => this.handleChange("password", x.target.value)} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>确认密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.confirmPassword} type="password" disabled={this.state.isSubmitting} value={this.state.confirmPassword} onChange={(x) => this.handleChange("confirmPassword", x.target.value)} />
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