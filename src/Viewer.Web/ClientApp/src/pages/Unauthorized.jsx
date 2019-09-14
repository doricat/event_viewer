import React from 'react'
import { Alert } from 'react-bootstrap'
import Layout from '../components/Layout'

export default () => {
    return (
        <Layout>
            <Alert variant="info">
                你不具备访问该模块的权限
            </Alert>
        </Layout>
    );
};