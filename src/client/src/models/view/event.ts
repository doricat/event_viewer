import { makeObservable, observable } from 'mobx';
import { EventLevel } from '../shared';

export class FilterModel {
    constructor(level?: EventLevel | 'all', startTime?: Date, endTime?: Date) {
        this.level = level;
        this.startTime = startTime;
        this.endTime = endTime;

        makeObservable(this, {
            level: observable,
            startTime: observable,
            endTime: observable,
            top: observable,
            skip: observable
        })
    }

    level?: EventLevel | 'all';
    startTime?: Date;
    endTime?: Date;
    top = 20;
    skip = 0;

    update(search: string): void {
        const params = new URLSearchParams(search);
        const level = params.get('level');
        const startTime = params.get('startTime');
        const endTime = params.get('endTime');
        const top = params.get('top');
        const skip = params.get('skip');

        this.level = (level ?? 'all') as EventLevel;
        this.startTime = startTime ? new Date(decodeURIComponent(startTime)) : undefined;
        this.endTime = endTime ? new Date(decodeURIComponent(endTime)) : undefined;
        this.top = top ? Number(top) : 20;
        this.skip = skip ? Number(skip) : 0;
    }

    toFilter() {
        return {
            level: this.level === 'all' ? undefined : this.level,
            startTime: this.startTime,
            endTime: this.endTime
        }
    }

    toQuery(applicationId: number) {
        const queries: string[] = [];
        queries.push(`application=${applicationId}`);
        queries.push(`top=${this.top}`);
        queries.push(`skip=${this.skip}`);
        if (this.level !== undefined) {
            queries.push(`level=${this.level}`);
        }

        if (this.startTime !== undefined) {
            const datetime = this.startTime.toISOString();
            const index = datetime.indexOf('.');
            queries.push(`startTime=${encodeURIComponent(datetime.substring(0, index))}`);
        }

        if (this.endTime !== undefined) {
            const datetime = this.endTime.toISOString();
            const index = datetime.indexOf('.');
            queries.push(`endTime=${encodeURIComponent(datetime.substring(0, index))}`);
        }

        return `/event/list?${queries.join('&')}`;
    }
}

export class MonitorSettings {
    constructor() {
        makeObservable(this, { levels: observable });
    }

    levels: EventLevel[] = ['critical', 'error', 'warning', 'information', 'debug', 'trace'];
}
