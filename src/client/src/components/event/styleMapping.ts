import { EventLevel } from '../../models/shared';

export const getStyle = (level: EventLevel) => {
    let style: string | undefined;

    switch (level) {
        case 'critical':
            style = 'primary';
            break;
        case 'error':
            style = 'danger';
            break;
        case 'warning':
            style = 'warning';
            break;
        case 'information':
            style = 'info';
            break;
        case 'debug':
            style = 'secondary';
            break;
        case 'trace':
            style = 'dark';
            break;
        default:
            throw new Error();
    }

    return style;
};
