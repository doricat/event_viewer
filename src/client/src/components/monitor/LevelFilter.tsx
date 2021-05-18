import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { EventLevel } from '../../models/shared';
import { MonitorSettings } from '../../models/view/event';
import { getStyle } from '../event/styleMapping';
import { MyContext } from '../../configureStore';

const levels: EventLevel[] = ['critical', 'error', 'warning', 'information', 'debug', 'trace'];

export const LevelFilter = observer((props: { settings: MonitorSettings; applicationId: number }) => {
    const context = useContext(MyContext);
    const { settings, applicationId } = props;
    const connected = settings.connectionId != null;

    const select = (level: EventLevel) => {
        const index = settings.levels.findIndex(x => x === level);
        const data = index === -1 ? level : `-${level}`;
        if (index === -1) {
            settings.levels.push(level);
        } else {
            settings.levels.splice(index, 1);
        }

        if (settings.connectionId != null) {
            context.event.updateMonitorSettings(settings.connectionId, applicationId, data);
        }
    };

    return (
        <div className="list-group">
            {levels.map((x) => {
                const active = settings.levels.some(y => x === y);
                const className = 'list-group-item list-group-item-action' + (active ? ` list-group-item-${getStyle(x)}` : '');
                return (<button key={x} type="button" className={className} disabled={!connected} onClick={() => select(x)}>{x}</button>);
            })}
        </div>
    );
});
