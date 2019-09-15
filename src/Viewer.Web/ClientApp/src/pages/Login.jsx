import React from 'react';
import Layout from '../components/Layout';
import { Row, Col } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined
        };
    }

    render() {
        return (
            <Layout>
                <Row>
                    <Col md={4}>
                        <section>
                            <LoginForm />
                        </section>
                    </Col>

                    <Col md={8}></Col>
                </Row>
            </Layout>
        );
    }
}

export default Login;