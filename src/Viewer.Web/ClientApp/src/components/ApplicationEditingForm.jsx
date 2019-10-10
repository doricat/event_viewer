import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { required, regexExpression, maxLength, stringLength, validate } from '../services/validators';
import { connect } from 'react-redux';
import { loading } from './Loading';
import { push } from 'connected-react-router';
import { actions as uiActions } from '../store/ui';
import { actions as applicationActions } from '../store/application';
import authorizeService from '../services/AuthorizeService';
import ApiResultAlert from './ApiResultAlert';
import { copyApiErrorToLocal } from '../services/apiErrorHandler';

const descriptor = {
    name: {
        displayName: "应用程序名称",
        validators: [
            (value) => required(value, descriptor.name.displayName),
            (value) => maxLength(value, 20, descriptor.name.displayName)
        ]
    },
    appId: {
        displayName: "应用程序Id",
        validators: [
            (value) => required(value, descriptor.appId.displayName),
            (value) => regexExpression(value, "^[A-Z0-9_]+$", descriptor.appId.displayName),
            (value) => stringLength(value, 6, 30, descriptor.appId.displayName)
        ]
    },
    description: {
        displayName: "描述",
        validators: [
            (value) => maxLength(value, 250, descriptor.description.displayName)
        ]
    },
    enabled: {
        displayName: "启用状态",
        validators: []
    }
};

class ApplicationEditingForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            id: undefined,
            formModel: {
                name: "",
                appId: "",
                description: "",
                enabled: true
            },
            messages: {
                formHeader: "创建一个新应用程序",
                button: "创建"
            },
            apiResult: null,
            errors: {
                name: null,
                appId: null,
                description: null,
            },
            localSuccessMessage: undefined
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.application && state.id === undefined) {
            const formModel = {
                name: props.application.name,
                appId: props.application.appId,
                description: props.application.description,
                enabled: props.application.enabled
            };

            return {
                formModel,
                id: props.application.id,
                messages: {
                    formHeader: "编辑一个应用程序",
                    button: "保存"
                }
            };
        }

        return null;
    }

    handleChange(key, value) {
        const formModel = { ...this.state.formModel };
        formModel[key] = value;
        this.setState({ formModel });
    }

    async handleSubmit(evt) {
        evt.preventDefault();

        const model = { ...this.state.formModel };
        const result = validate(model, descriptor);

        if (result.hasError) {
            let errors = { ...this.state.errors };
            result.copyMessages(result, errors);
            this.setState({ errors: errors });
            return;
        }

        this.setState({ isSubmitting: true, apiResult: null });

        const token = await authorizeService.getAccessToken();
        let headers = !token ? {} : { "Authorization": `Bearer ${token}` };
        headers["Content-Type"] = "application/json";
        let response;

        if (this.props.application) {
            response = await fetch(`/api/applications/${this.state.id}`,
                {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify(model)
                });
        } else {
            response = await fetch("/api/applications",
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(model)
                });
        }

        this.setState({ isSubmitting: false });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.ok === true) {
                this.setState({ localSuccessMessage: "操作成功！" });
                this.props.appendNewAppToList({ ...model, id: json.value.id })
                setTimeout(() => {
                    this.props.cancel();
                }, 1000);
                return;
            }

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
                this.setState({ localSuccessMessage: "操作成功！" });
                setTimeout(() => {
                    this.props.cancel();
                }, 1000);
                return;
            }

            if (response.status === 401) {
                authorizeService.signOut();
                this.props.redirectToLogin();
            }

            if (response.status === 403) {
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
        const { isSubmitting } = this.state;

        return (
            <Form noValidate className="needs-validation" onSubmit={(x) => this.handleSubmit(x)}>
                <h4>{this.state.messages.formHeader}</h4>
                <hr />
                <ApiResultAlert message={this.state.localSuccessMessage} apiResult={this.state.apiResult} />
                <Form.Group>
                    <Form.Label>应用程序名称</Form.Label>
                    <Form.Control type="text"
                        isInvalid={this.state.errors.name}
                        disabled={isSubmitting}
                        onChange={(x) => this.handleChange("name", x.target.value)}
                        value={this.state.formModel.name}
                        onBlur={() => this.handleValidate("name")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>应用程序Id</Form.Label>
                    <Form.Control type="text"
                        isInvalid={this.state.errors.appId}
                        disabled={isSubmitting}
                        onChange={(x) => this.handleChange("appId", x.target.value)}
                        value={this.state.formModel.appId}
                        onBlur={() => this.handleValidate("appId")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.appId}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label>描述</Form.Label>
                    <Form.Control as="textarea" rows="3"
                        isInvalid={this.state.errors.description}
                        disabled={isSubmitting}
                        onChange={(x) => this.handleChange("description", x.target.value)}
                        value={this.state.formModel.description}
                        onBlur={() => this.handleValidate("description")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.description}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Check type="checkbox" label="启用状态"
                        disabled={isSubmitting}
                        onChange={(x) => this.handleChange("enabled", x.target.checked)}
                        checked={this.state.formModel.enabled} />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting}>{this.state.messages.button}</Button>
                <Button variant="secondary" type="button" style={{ marginLeft: "1.25rem" }} disabled={isSubmitting} onClick={() => this.props.cancel(this.state.id)}>取消</Button>
            </Form>
        );
    }
}

export default loading(connect(null, dispatch => {
    return {
        cancel: (id) => {
            if (id) {
                dispatch(push(`/application/${id}`));
            } else {
                dispatch(push("/application"));
            }
        },
        redirectToLogin: () => dispatch(push("/account/login")),
        setGlobalError: (message) => dispatch(uiActions.setGlobalError(true, message)),
        appendNewAppToList: (app) => dispatch(applicationActions.appendApplicationToList(app))
    }
})(ApplicationEditingForm), () =>
    (
        <Alert variant="info"><i>加载中...</i></Alert>
    )
);