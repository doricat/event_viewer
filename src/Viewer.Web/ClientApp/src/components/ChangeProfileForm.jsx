import React from 'react';
import { Form, Button } from 'react-bootstrap';

class ChangeProfileForm extends React.Component {
    render() {
        return (
            <Form >

                <Form.Group>
                    <Form.Label>名称</Form.Label>
                    <Form.Control type="text" />
                </Form.Group>

                <Form.Group >
                    <Button type="submit" variant="primary">更行</Button>
                </Form.Group>

            </Form>
        );
    }
}

export default ChangeProfileForm;