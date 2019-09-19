import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/RegisterForm';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: undefined
        };
    }

    navigate() {
        this.props.push("/account/login");
    }

    render() {
        return (
            <Row>
                <Col md={4}>
                    <section>
                        <RegisterForm navigate={() => this.navigate()} />
                    </section>
                </Col>

                <Col md={8}></Col>
            </Row>
        );
    }
}

export default connect(null, { push })(Register);