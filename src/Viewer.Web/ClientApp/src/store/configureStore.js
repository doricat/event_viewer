import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

export const history = createBrowserHistory();

const middleware = [routerMiddleware(history), thunk];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}

export default function configureStore(preloadedState) {
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        compose(
            applyMiddleware(
                ...middleware
            )
        )
    );

    return store
};