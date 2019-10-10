import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { required, regexExpression, stringLength, compare, validate } from '../services/validators';
import authorizeService from '../services/AuthorizeService';
import { actions as uiActions } from '../store/ui';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import ApiResultAlert from './ApiResultAlert';
import { copyApiErrorToLocal } from '../services/apiErrorHandler';

const descriptor = {
    currentPassword: {
        displayName: "当前密码",
        validators: [
            (value) => required(value, descriptor.currentPassword.displayName),
            (value) => stringLength(value, 6, 16, descriptor.currentPassword.displayName)
        ]
    },
    password: {
        displayName: "密码",
        validators: [
            (value) => required(value, descriptor.password.displayName),
            (value) => stringLength(value, 6, 16, descriptor.password.displayName)
            //(value) => regexExpression(value, "^[a-zA-Z\\d]$", descriptor.password.displayName)
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

const formModelInitState = {
    currentPassword: "",
    password: "",
    confirmPassword: ""
};

class ChangePasswordForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            formModel: { ...formModelInitState },
            apiResult: null,
            errors: {
                currentPassword: null,
                password: null,
                confirmPassword: null
            },
            localSuccessMessage: undefined
        };
    }

    handleChange(key, value) {
        let model = { ...this.state.formModel };
        model[key] = value;
        this.setState({ formModel: model });
    }

    async handleSubmit(event) {
        event.preventDefault();

        const model = { ...this.state.formModel };
        const result = validate(model, descriptor);

        if (result.hasError) {
            let errors = { ...this.state.errors };
            result.copyMessages(result, errors);
            this.setState({ errors: errors });
            return;
        }

        this.setState({ isSubmitting: true, apiResult: null, localSuccessMessage: undefined });

        const token = await authorizeService.getAccessToken();
        let headers = !token ? {} : { "Authorization": `Bearer ${token}` };
        headers["Content-Type"] = "application/json";
        const response = await fetch("/api/accounts/current/password", {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(model)
        });

        this.setState({ isSubmitting: false });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.status >= 400 && response.status < 500) {
                let errors = { ...this.state.errors };
                const apiErrors = copyApiErrorToLocal(json, errors);
                this.setState({
                    apiResult: json,
                    formModel: { ...formModelInitState },
                    errors: apiErrors
                });
                return;
            }

            if (response.status === 500) {
                this.props.setGlobalError(json.error.message);
                return;
            }

            console.error(json);
        } else {
            if (response.ok === true) {
                this.setState({
                    formModel: { ...formModelInitState },
                    localSuccessMessage: "操作成功！"
                });
                return;
            }

            if (response.status === 401) {
                authorizeService.signOut();
                this.props.redirectToLogin();
            }
        }
    }

    handleValidate(key) {
        const model = { ...this.state.formModel };
        const result = validate(model, descriptor);

        let errors = { ...this.state.errors };
        if (result.hasError) {
            errors[key] = result[key];
        } else {
            errors[key] = null;
        }

        this.setState({ errors: errors });
    }

    render() {
        return (
            <Form noValidate className="needs-validation" onSubmit={(x) => this.handleSubmit(x)}>
                <ApiResultAlert message={this.state.localSuccessMessage} apiResult={this.state.apiResult} />
                <Form.Group>
                    <Form.Label>当前密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.currentPassword} type="password"
                        disabled={this.state.isSubmitting}
                        value={this.state.formModel.currentPassword}
                        onChange={(x) => this.handleChange("currentPassword", x.target.value)}
                        onBlur={() => this.handleValidate("currentPassword")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.currentPassword}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>新密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.password} type="password"
                        disabled={this.state.isSubmitting}
                        value={this.state.formModel.password}
                        onChange={(x) => this.handleChange("password", x.target.value)}
                        onBlur={() => this.handleValidate("password")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>确认新密码</Form.Label>
                    <Form.Control isInvalid={this.state.errors.confirmPassword} type="password"
                        disabled={this.state.isSubmitting}
                        value={this.state.formModel.confirmPassword}
                        onChange={(x) => this.handleChange("confirmPassword", x.target.value)}
                        onBlur={() => this.handleValidate("confirmPassword")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary" disabled={this.state.isSubmitting}>更新密码</Button>
                </Form.Group>

            </Form>
        );
    }
}

export default connect(null, dispatch => {
    return {
        redirectToLogin: () => dispatch(push("/account/login")),
        setGlobalError: (message) => dispatch(uiActions.setGlobalError(true, message))
    }
})(ChangePasswordForm);