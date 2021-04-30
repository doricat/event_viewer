import React from 'react';
import { Layout } from './components/shared/Layout';
import { Routes } from './routes/Index';
import './App.css';

export const App = () => {
    return (
        <Layout>
            <Routes />
        </Layout>
    );
}
