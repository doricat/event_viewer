import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { required, regexExpression, maxLength, stringLength, validate } from '../services/validators';
import { connect } from 'react-redux';
import { loading } from './Loading';
import { push } from 'connected-react-router';

const descriptor = {
    appName: {
        displayName: "应用程序名称",
        validators: [
            (value) => required(value, descriptor.appName.displayName),
            (value) => maxLength(value, 20, descriptor.appName.displayName)
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
                appName: "",
                appId: "",
                description: "",
                enabled: ""
            },
            messages: {
                formHeader: "创建一个新应用程序",
                button: "创建"
            },
            apiResult: null,
            errors: {
                appName: null,
                appId: null,
                description: null,
            }
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.application && state.id === undefined) {
            const formModel = {
                appName: props.application.appName,
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

        console.log(formModel);
    }

    handleSubmit(evt) {
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

        if (this.props.application) {
            // todo update
        } else {
            // todo create

            // this.props.dispatch(applicationActions.fetchCreateApplication(
            //     {
            //         ...model,
            //         enabled: this.state.enabled
            //     },
            //     error => {
            //         const { code, message, details } = error;
            //         let errors = { ...this.state.errors };
            //         for (let i = 0; i < details.length; i++) {
            //             const detail = details[i];
            //             if (detail.target && errors.hasOwnProperty(detail.target)) {
            //                 errors[detail.target] = detail.message;
            //             }
            //         }

            //         this.setState({
            //             apiResult: {
            //                 code,
            //                 message
            //             },
            //             errors: errors
            //         });
            //     },
            //     () => {
            //         this.props.cancel();
            //     })
            // );
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
                {
                    this.state.apiResult !== null
                        ?
                        <Alert variant="warning">{this.state.apiResult.message}</Alert>
                        :
                        null
                }
                <Form.Group>
                    <Form.Label>应用程序名称</Form.Label>
                    <Form.Control type="text"
                        isInvalid={this.state.errors.appName}
                        disabled={isSubmitting}
                        onChange={(x) => this.handleChange("appName", x.target.value)}
                        value={this.state.formModel.appName}
                        onBlur={() => this.handleValidate("appName")} />
                    <Form.Control.Feedback type="invalid">{this.state.errors.appName}</Form.Control.Feedback>
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
        }
    }
})(ApplicationEditingForm), () =>
    (
        <Alert variant="info"><i>加载中...</i></Alert>
    )
);