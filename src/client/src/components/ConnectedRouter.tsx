import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Router } from 'react-router';
import { StoreContext } from '../stores';
import { History, Location } from 'history';
import { isEqualWith } from 'lodash';

interface Props {
    children: React.ReactNode;
    history: History;
}

export const ConnectedRouter = observer((props: Props) => {
    const context = useContext(StoreContext);
    const [inTimeTravelling, setTimeTravelling] = useState(false);

    const handleLocationChange = (location: Location, action: string, isFirstRendering = false) => {
        if (!inTimeTravelling) {
            context.router.changeLocation(location, action, isFirstRendering)
        } else {
            setTimeTravelling(false);
        }
    };

    const updateLocation = () => {
        const storeLocation: Location = { ...context.router.location };
        const historyLocation: Location = { ...props.history.location };
        if (props.history.action === 'PUSH'
            && (historyLocation.pathname !== storeLocation.pathname
                || historyLocation.search !== storeLocation.search
                || historyLocation.hash !== storeLocation.hash
                || !isEqualWith(storeLocation.state, historyLocation.state))
        ) {
            setTimeTravelling(true);
            props.history.push(storeLocation);
        }
    };

    useEffect(() => {
        const callback = props.history.listen(handleLocationChange);
        return () => {
            callback();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    updateLocation();

    return (
        <Router history={props.history}>
            {props.children}
        </Router>
    );
});
