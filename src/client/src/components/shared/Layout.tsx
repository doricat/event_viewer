import React from 'react';
import { ErrorModal } from './ErrorModal';
import { NavMenu } from './NavMenu';

interface Props {
    children: React.ReactNode;
}

export function Layout(props: Props) {
    return (
        <>
            <NavMenu />
            {props.children}
            <ErrorModal />
        </>
    );
}
