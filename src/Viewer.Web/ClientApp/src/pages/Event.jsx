import React from 'react'
import { Alert } from 'react-bootstrap'
import Layout from '../components/Layout'

class Event extends React.Component {
    render() {
        return (
            <Layout>
                <Alert variant="info">
                    建设中
                </Alert>
            </Layout>
        );
    }
}

export default Event;