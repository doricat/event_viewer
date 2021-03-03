import React, { useState, useEffect, useRef, useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { EventItem } from './Item';
import { fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { observer } from 'mobx-react';
import { StoreContext } from '../../stores';
import { FilterModel } from '../../models/view/event';

const windowScrollTop = () => {
    return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
};

const isScrolledIntoView = (elem: HTMLHeadingElement) => {
    const docViewTop = windowScrollTop();
    const docViewBottom = windowScrollTop() + window.innerHeight;

    const elemTop = elem.offsetTop;
    var elemBottom = elemTop + elem.clientHeight;

    return (elemBottom <= docViewBottom) && (elemTop >= docViewTop);
};

export const EventList = observer((props: { model: FilterModel; }) => {
    const context = useContext(StoreContext);
    const [list, setList] = useState<JSX.Element[]>([]);
    const footerElement = useRef<HTMLHeadingElement>(null);
    const count = useRef<number>(0);

    useEffect(() => {
        const subscription = fromEvent(window, 'scroll')
            .pipe(debounce(() => interval(2000)))
            .subscribe(() => {
                if (footerElement.current && isScrolledIntoView(footerElement.current)) {
                    props.model.skip = count.current;
                }
            });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const events = context.event.events.splice(0);
        if (events.length > 0) {
            const items: JSX.Element[] = [...list];
            events.forEach(x => items.push(<EventItem key={x.id.toString()} event={x} />));
            setList(items);
            count.current = items.length;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.event.events.length]);

    useEffect(() => {
        setList([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.model.level, props.model.startTime, props.model.endTime]);

    let message: string | undefined = undefined;
    if (list.length === 0) {
        message = '暂无数据';
    } else if (context.event.count === list.length) {
        message = '没有更多数据';
    }

    let footer: JSX.Element | null = null;
    if (message) {
        footer = (
            <Alert variant="success" key="-1">
                {message}
            </Alert>
        );
    }

    return (
        <div>
            {list}
            {footer}
            <div ref={footerElement} style={{ height: '10px', width: '100%' }}></div>
        </div>
    );
});
