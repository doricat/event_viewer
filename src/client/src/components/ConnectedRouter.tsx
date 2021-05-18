import React, { useContext, useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Router } from 'react-router';
import { History, Location } from 'history';
import { isEqualWith } from 'lodash';
import { MyContext } from '../configureStore';

interface Props {
    children: React.ReactNode;
    history: History;
}

export const ConnectedRouter = observer((props: Props) => {
    const context = useContext(MyContext);
    const inTimeTravelling = useRef(false);

    const handleLocationChange = (location: Location, action: string, isFirstRendering = false) => {
        if (!inTimeTravelling.current) {
            context.router.changeLocation(location, action, isFirstRendering);
        } else {
            inTimeTravelling.current = false;
        }
    };

    useEffect(() => {
        const storeLocation: Location = { ...context.router.location };
        const historyLocation: Location = { ...props.history.location };
        if (props.history.action === 'PUSH'
            && (historyLocation.pathname !== storeLocation.pathname
                || historyLocation.search !== storeLocation.search
                || historyLocation.hash !== storeLocation.hash
                || !isEqualWith(storeLocation.state, historyLocation.state))
        ) {
            inTimeTravelling.current = true;
            props.history.push(storeLocation);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.router.location]);

    useEffect(() => {
        const callback = props.history.listen(handleLocationChange);
        return () => {
            callback();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Router history={props.history}>
            {props.children}
        </Router>
    );
});
