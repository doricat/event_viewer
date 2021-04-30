import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { LevelFilter } from '../components/monitor/LevelFilter';
import { MonitorSettings } from '../models/view/event';
import { ApplicationListGroupContainer } from '../components/shared/ApplicationListGroupContainer';
import { ApplicationListGroup } from '../components/event/ApplicationListGroup';
import { EventBox } from '../components/monitor/EventBox';
import { StoreContext } from '../stores';
import { EventHelper } from '../components/event/Helper';
import { Redirect } from 'react-router';
import { Loading } from '../components/Loading';

export const Monitor = observer((props: { location: Location; }) => {
    const context = useContext(StoreContext);
    const [settings] = useState(() => new MonitorSettings());

    useEffect(() => {
        if (settings.connectionId == null) {
            settings.resetLevels();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.connectionId]);

    const params = new URLSearchParams(props.location.search);
    const applicationId = Number(params.get('application') ?? '-1');
    let elem: JSX.Element;
    if (applicationId === -1) {
        elem = (<EventHelper />);
    } else {
        if (context.application.applications == null) {
            elem = (<Loading />);
        } else {
            const index = context.application.applications.findIndex(x => x.id === applicationId);
            const accessToken = context.account.accessToken;
            elem = index !== -1
                ? (
                    <EventBox key={applicationId.toString()}
                        applicationId={applicationId}
                        settings={settings}
                        maxEvents={200}
                        accessToken={accessToken} />
                )
                : (<Redirect to="404" />);
        }
    }

    return (
        <div className="container-fluid bd-layout">
            <div className="bd-sidebar">
                <nav className="bd-links">
                    <LevelFilter settings={settings} applicationId={applicationId} />
                    <div style={{ height: '20px' }}></div>
                    <ApplicationListGroupContainer path={'/monitor'} component={ApplicationListGroup} />
                </nav>
            </div>

            <div>
                {elem}
            </div>
        </div>
    );
});
