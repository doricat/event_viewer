import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as uiReducer } from './ui';
import { reducer as applicationReducer } from './application';
import { reducer as userReducer } from './user'

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ui: uiReducer,
    application: applicationReducer,
    user: userReducer
});

export default createRootReducer;