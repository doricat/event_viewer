import React from 'react';
import { observer } from 'mobx-react';
import { EventLevel } from '../../models/shared';
import { MonitorSettings } from '../../models/view/event';

const levels: EventLevel[] = ['critical', 'error', 'warning', 'information', 'debug', 'trace'];

export const LevelFilter = observer((props: { settings: MonitorSettings }) => {
    const { settings } = props;

    const select = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, level: EventLevel) => {
        evt.preventDefault();

        const index = settings.levels.findIndex(x => x === level);
        if (index === -1) {
            settings.levels.push(level);
        } else {
            settings.levels.splice(index, 1);
        }
    };

    return (
        <div className="list-group">
            {levels.map((x) => {
                const active = settings.levels.some(y => x === y);
                const className = 'list-group-item list-group-item-action' + (active ? ' active' : '');
                return (<button type="button" className={className} onClick={(evt) => select(evt, x)}>{x}</button>);
            })}
        </div>
    );
});
