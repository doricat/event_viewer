import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import * as signalR from '@microsoft/signalr';
import { Alert } from 'react-bootstrap';
import { fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { MonitorSettings } from '../../models/view/event';
import { makeObservable, observable } from 'mobx';
import { EventItem } from '../event/Item';
import { ApplicationEvent } from '../../models/entity/application';
import { isScrolledIntoView } from '../../infrastructure/domHelper';

class EventContainer {
    constructor() {
        makeObservable(this, {
            events: observable
        });
    }

    events: ApplicationEvent[] = [];
}

interface Props {
    applicationId: number;
    settings: MonitorSettings;
    maxEvents: number;
    accessToken: string;
}

export const EventBox = observer((props: Props) => {
    const [model] = useState(() => new EventContainer());
    const footerElement = useRef<HTMLDivElement>(null);
    const autoScroll = useRef<boolean>(true);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/hub/event?application=${props.applicationId}`, { accessTokenFactory: () => props.accessToken })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on('ReceiveEvent', (args: ApplicationEvent) => {
            if (props.settings.levels.findIndex(x => x === args.level) === -1) {
                return;
            }

            if (model.events.length > props.maxEvents) {
                model.events.shift();
            }

            model.events.push(args);
        });

        connection.onclose(() => {
            props.settings.connectionId = null;
        });

        connection.start().then(() => {
            props.settings.connectionId = connection.connectionId;
        }).catch(error => console.error(error.toString()));

        return () => {
            props.settings.connectionId = null;
            connection.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const subscription = fromEvent(window, 'scroll')
            .pipe(debounce(() => interval(500)))
            .subscribe(() => {
                autoScroll.current = footerElement.current != null && isScrolledIntoView(footerElement.current);
            });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (footerElement.current && autoScroll.current) {
            footerElement.current.scrollIntoView();
        }
    }, [model.events.length]);

    const message = props.settings.connectionId == null
        ? '连接中...'
        : (model.events.length === 0 ? '等待数据...' : undefined);
    const footer = message !== undefined
        ? (
            <Alert variant="success" key="-1">
                {message}
            </Alert>
        )
        : null;

    return (
        <div>
            {model.events.map(x => <EventItem key={x.id.toString()} event={x} />)}
            {footer}
            <div ref={footerElement} style={{ height: '10px', width: '100%' }}></div>
        </div>
    );
});
