import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { MyContext } from '../configureStore';

interface Props {
    children: React.ReactNode;
}

export const ScrollToTop: React.FC<Props> = observer((props: Props) => {
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [context.router.location]);

    return <>{props.children}</>;
});
