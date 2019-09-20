import React from 'react';
import { Row, Col } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

class Login extends React.Component {
    navigate() {
        this.props.push("/");
    }

    render() {
        return (
            <Row>
                <Col md={4}>
                    <section>
                        <LoginForm navigate={() => this.navigate()} />
                    </section>
                </Col>

                <Col md={8}></Col>
            </Row>
        );
    }
}

export default connect(null, { push })(Login);