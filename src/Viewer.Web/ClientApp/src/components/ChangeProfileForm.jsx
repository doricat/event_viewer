import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { required, maxLength, validate } from '../services/validators';
import authorizeService from '../services/AuthorizeService';
import { actions as uiActions } from '../store/ui';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import ApiResultAlert from './ApiResultAlert';
import { copyApiErrorToLocal } from '../services/apiErrorHandler';

const descriptor = {
    name: {
        displayName: "名称",
        validators: [
            (value) => required(value, descriptor.name.displayName),
            (value) => maxLength(value, 20, descriptor.name.displayName)
        ]
    }
};

class ChangeProfileForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            formModel: {
                name: this.props.name
            },
            apiResult: null,
            errors: {
                name: null
            },
            localSuccessMessage: undefined
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.formModel.name === "" && props.name !== state.formModel.name) {
            return {
                formModel: {
                    name: props.name
                }
            };
        }

        return null;
    }

    handleChange(key, value) {
        let model = {};
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
        const response = await fetch("/api/accounts/current/profiles/name", {
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
                this.setState({ apiResult: json, errors: apiErrors });
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
                    localSuccessMessage: "操作成功！"
                });
                this.props.reloadProfiles();
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
                    <Form.Label>名称</Form.Label>
                    <Form.Control isInvalid={this.state.errors.name} type="text"
                        disabled={this.state.isSubmitting}
                        value={this.state.formModel.name}
                        onChange={(x) => this.handleChange("name", x.target.value)}
                        onBlur={() => this.handleValidate("name")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary" disabled={this.state.isSubmitting}>更新</Button>
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
})(ChangeProfileForm);