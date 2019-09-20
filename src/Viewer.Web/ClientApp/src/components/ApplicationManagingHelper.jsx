import React from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default () => (
    <>
        <Alert variant="success">
            <Alert.Heading>提示</Alert.Heading>
            <p>请选择一个应用或创建一个新的应用</p>
            <hr />
            <div className="d-flex justify-content-end">
                <Link to={"/application/create"} className="btn btn-outline-success">创建</Link>
            </div>
        </Alert>
    </>
);