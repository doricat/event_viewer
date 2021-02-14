import React from 'react';
import { Container } from 'react-bootstrap';

interface Props {
    children: React.ReactNode;
}

export function NormalLayout(props: Props) {
    return (
        <Container>
            {props.children}
        </Container>
    );
}
