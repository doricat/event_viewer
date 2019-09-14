import React from 'react'
import { Alert } from 'react-bootstrap'
import Layout from '../components/Layout'

export default () => {
    return (
        <Layout>
            <Alert variant="info">
                你迷路了
            </Alert>
        </Layout>
    );
};