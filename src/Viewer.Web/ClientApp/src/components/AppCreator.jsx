import React from 'react';
import { Form, Button } from 'react-bootstrap';

class AppCreator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            appName: "",
            appId: "",
            description: "",
            enabled: "",
            errors: {}
        };
    }

    handleChange(key, value) {
        let obj = {};
        obj[key] = value;
        this.setState(obj);
    }

    handleSubmit(evt) {
        evt.preventDefault();
    }

    validate() {

    }

    render() {
        const { isSubmitting } = this.state;

        return (
            <Form noValidate className="needs-validation" onSubmit={(x) => this.handleSubmit(x)}>
                <h4>123</h4>
                <hr />
                <Form.Group>
                    <Form.Label>应用程序名称</Form.Label>
                    <Form.Control type="text" disabled={isSubmitting} onChange={(x) => this.handleChange("appName", x.target.value)} value={this.state.appName} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>应用程序Id</Form.Label>
                    <Form.Control type="text" disabled={isSubmitting} onChange={(x) => this.handleChange("appId", x.target.value)} value={this.state.appId} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>描述</Form.Label>
                    <Form.Control as="textarea" rows="3" disabled={isSubmitting} onChange={(x) => this.handleChange("description", x.target.value)} value={this.state.description} />
                </Form.Group>

                <Form.Group>
                    <Form.Check type="checkbox" label="启用状态" disabled={isSubmitting} onChange={(x) => this.handleChange("enabled", x.target.checked)} checked={this.state.enabled} />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting}>创建</Button>
                <Button variant="secondary" type="button" style={{ marginLeft: "1.25rem" }} disabled={isSubmitting} onClick={() => this.props.history.goBack()}>取消</Button>
            </Form>
        );
    }
}

export default AppCreator;