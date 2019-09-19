import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/RegisterForm';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined
        };
    }

    render() {
        return (
            <Row>
                <Col md={4}>
                    <section>
                        <RegisterForm />
                    </section>
                </Col>

                <Col md={8}></Col>
            </Row>
        );
    }
}

export default Register;