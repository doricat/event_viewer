import React from 'react';
import { ListGroup } from 'react-bootstrap';

const style = {
    cursor: "pointer"
};

const getActive = (level, levels) => {
    return levels.findIndex((x) => x === level) !== -1;
};

export default ({ isSubmitting, setLevel, levels }) => {
    return (
        <ListGroup>
            <ListGroup.Item disabled={isSubmitting} style={style} variant={getActive("critical", levels) ? "primary" : null} onClick={() => setLevel("critical")}>Critical</ListGroup.Item>
            <ListGroup.Item disabled={isSubmitting} style={style} variant={getActive("error", levels) ? "danger" : null} onClick={() => setLevel("error")}>Error</ListGroup.Item>
            <ListGroup.Item disabled={isSubmitting} style={style} variant={getActive("warning", levels) ? "warning" : null} onClick={() => setLevel("warning")}>Warning</ListGroup.Item>
            <ListGroup.Item disabled={isSubmitting} style={style} variant={getActive("information", levels) ? "info" : null} onClick={() => setLevel("information")}>Info</ListGroup.Item>
            <ListGroup.Item disabled={isSubmitting} style={style} variant={getActive("debug", levels) ? "secondary" : null} onClick={() => setLevel("debug")}>Debug</ListGroup.Item>
            <ListGroup.Item disabled={isSubmitting} style={style} variant={getActive("trace", levels) ? "dark" : null} onClick={() => setLevel("trace")}>Trace</ListGroup.Item>
        </ListGroup>
    );
};