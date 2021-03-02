import React from 'react';
import { ConnectedRouter } from './components/ConnectedRouter';
import { Layout } from './components/shared/Layout';
import { Routes } from './routes/Index';
import { history } from './stores';

export function App() {
    return (
        <ConnectedRouter history={history}>
            <Layout>
                <Routes />
            </Layout>
        </ConnectedRouter>
    );
}
