import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import authorizeService from '../services/AuthorizeService';
import { required, validate } from '../services/validators';
import ApiResultAlert from './ApiResultAlert';
import { actions as userActions } from '../store/user';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

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
    },
    rememberMe: {
        displayName: "记住我",
        validators: []
    }
};

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            formModel: {
                email: "",
                password: "",
                rememberMe: true,
            },
            apiResult: null,
            invalid: {
                email: false,
                password: false
            }
        };
    }

    handleChange(key, value) {
        let formModel = { ...this.state.formModel };
        formModel[key] = value;
        this.setState({ formModel });
    }

    handleSubmit(event) {
        event.preventDefault();

        const model = { ...this.state.formModel };
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

        authorizeService.signIn(model).then(result => {
            this.setState({ isSubmitting: false });
            if (result.succeeded === true) {
                this.props.loadProfiles();
                this.props.navigate();
            } else {
                this.setState({
                    apiResult: result.apiResult,
                    formModel: {
                        ...this.state.formModel,
                        password: ""
                    }
                });
            }
        });
    }

    handleValidate(key) {
        const model = { ...this.state.formModel };
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
                <ApiResultAlert apiResult={this.state.apiResult} />
                <Form.Group>
                    <Form.Label>电子邮件</Form.Label>
                    <Form.Control isInvalid={this.state.invalid.email} type="email"
                        disabled={this.state.isSubmitting}
                        onChange={(x) => this.handleChange("email", x.target.value)}
                        value={this.state.formModel.email}
                        onBlur={() => this.handleValidate("email")}
                        autoComplete="off"
                        maxLength="120" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>密码</Form.Label>
                    <Form.Control isInvalid={this.state.invalid.password} type="password"
                        disabled={this.state.isSubmitting}
                        onChange={(x) => this.handleChange("password", x.target.value)}
                        value={this.state.formModel.password}
                        onBlur={() => this.handleValidate("password")}
                        maxLength="16" />
                </Form.Group>

                <Form.Group >
                    <Form.Check type="checkbox" label="记住我"
                        checked={this.state.formModel.rememberMe}
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

export default connect(null, dispatch => {
    return {
        loadProfiles: () => dispatch(userActions.fetchLoadCurrentProfiles()),
        navigate: () => dispatch(push("/"))
    };
})(LoginForm);