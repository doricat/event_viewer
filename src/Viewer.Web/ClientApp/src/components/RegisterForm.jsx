import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    handleChange(key, value) {

    }

    handleClick(evt) {
        evt.preventDefault();
    }

    render() {
        return <Form >
            <h4>创建一个新账户</h4>
            <hr />
            <Alert variant="success">message</Alert>
            <Form.Group>
                <Form.Label>电子邮件</Form.Label>
                <Form.Control type="email" />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Form.Group>
                <Form.Label>密码</Form.Label>
                <Form.Control type="password" />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Form.Group>
                <Form.Label>确认密码</Form.Label>
                <Form.Control type="password" />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Form.Group >
                <Button type="submit" variant="primary" onClick={(x) => this.handleClick(x)}>注册</Button>
            </Form.Group>
        </Form>
    }
}