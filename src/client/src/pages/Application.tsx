import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { EditionForm } from '../components/application/EditionForm';
import { Layout } from '../components/application/Layout';
import { ManagementHelper } from '../components/application/ManagementHelper';
import { ManagementPanelContainer } from '../components/application/ManagementPanelContainer';
import { SubscriberSelectorContainer } from '../components/application/SubscriberSelectorContainer';
import { NormalLayout } from '../components/shared/NormalLayout';

export function Application() {
    return (
        <NormalLayout>
            <Layout>
                <Switch>
                    <Route path="/application/create" render={() => (<EditionForm />)} />
                    <Route path="/application/:id/edit" render={({ match }) => (
                        <EditionForm
                            applicationId={Number(match.params.id)}
                            key={match.params.id} />
                    )} />
                    <Route path="/application/:id/subscribers" render={({ match }) => (
                        <SubscriberSelectorContainer
                            applicationId={Number(match.params.id)}
                            key={match.params.id} />
                    )} />
                    <Route path="/application/:id" render={({ match }) => (
                        <ManagementPanelContainer
                            applicationId={Number(match.params.id)}
                            key={match.params.id} />
                    )} />
                    <Route path="/application" exact={true} component={ManagementHelper} />
                    <Redirect to="/application" />
                </Switch>
            </Layout>
        </NormalLayout>
    );
}
