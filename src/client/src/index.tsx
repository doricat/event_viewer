import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { StoreContext, store, history } from './stores';
import { ConnectedRouter } from './components/ConnectedRouter';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <StoreContext.Provider value={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </StoreContext.Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
