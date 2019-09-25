import React from 'react';
import { Alert, Button } from 'react-bootstrap';

export default () => (
    <div>
        <Alert variant="primary">
            <Alert.Heading>Critical</Alert.Heading>
            <p>这里是日志消息</p>
            <hr />
            <p className="mb-0">这里是日志的附加信息</p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button variant="outline-info">在新窗口查看</Button>
            </div>
        </Alert>

        <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>这里是日志消息</p>
            <hr />
            <p className="mb-0">这里是日志的附加信息</p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button variant="outline-info">在新窗口查看</Button>
            </div>
        </Alert>

        <Alert variant="warning">
            <Alert.Heading>Warning</Alert.Heading>
            <p>这里是日志消息</p>
            <hr />
            <p className="mb-0">这里是日志的附加信息</p>
            <div className="d-flex justify-content-end">
                <Button variant="outline-info">在新窗口查看</Button>
            </div>
        </Alert>

        <Alert variant="info">
            <Alert.Heading>Info</Alert.Heading>
            <p>这里是日志消息</p>
            <hr />
            <p className="mb-0">这里是日志的附加信息</p>
            <div className="d-flex justify-content-end">
                <Button variant="outline-info">在新窗口查看</Button>
            </div>
        </Alert>

        <Alert variant="secondary">
            <Alert.Heading>Debug</Alert.Heading>
            <p>这里是日志消息</p>
            <hr />
            <p className="mb-0">这里是日志的附加信息</p>
            <div className="d-flex justify-content-end">
                <Button variant="outline-info">在新窗口查看</Button>
            </div>
        </Alert>

        <Alert variant="dark">
            <Alert.Heading>Trace</Alert.Heading>
            <p>这里是日志消息</p>
            <hr />
            <p className="mb-0">这里是日志的附加信息</p>
            <div className="d-flex justify-content-end">
                <Button variant="outline-info">在新窗口查看</Button>
            </div>
        </Alert>

        <Alert variant="success">
            没有更多数据
        </Alert>
    </div>
);