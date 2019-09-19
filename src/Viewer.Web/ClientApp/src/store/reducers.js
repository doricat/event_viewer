import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as uiReducer } from './ui';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ui: uiReducer
});

export default createRootReducer;