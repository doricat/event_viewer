import React from 'react';
import { Form, Button } from 'react-bootstrap';

class ChangePasswordForm extends React.Component {
    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>当前密码</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>新密码</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>确认新密码</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary">更新密码</Button>
                </Form.Group>

            </Form>
        );
    }
}

export default ChangePasswordForm;