import { observer } from 'mobx-react';
import React, { useEffect, useContext } from 'react';
import { MyContext } from '../../configureStore';
import { ErrorModal } from './ErrorModal';
import { NavMenu } from './NavMenu';

interface Props {
    children: React.ReactNode;
}

export const Layout = observer((props: Props) => {
    const context = useContext(MyContext);

    useEffect(() => {
        if (context.account.isAuthenticated) {
            context.application.loadApplications();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.account.isAuthenticated]);

    return (
        <>
            <NavMenu />
            {props.children}
            <ErrorModal />
        </>
    );
});
