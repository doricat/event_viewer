import React from 'react';
import { Layout } from './components/shared/Layout';
import { Routes } from './routes/Index';
import { ScrollToTop } from './components/ScrollToTop';
import './App.css';

export const App = () => {
    return (
        <ScrollToTop>
            <Layout>
                <Routes />
            </Layout>
        </ScrollToTop>
    );
}
