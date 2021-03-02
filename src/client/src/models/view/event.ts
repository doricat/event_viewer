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

    update(query?: Map<string, string[]>): void {
        const level = query?.get('level');
        const startTime = query?.get('startTime');
        const endTime = query?.get('endTime');
        const top = query?.get('top');
        const skip = query?.get('skip');

        this.level = (level && level.length > 0 ? level[0] : 'all') as EventLevel;
        this.startTime = startTime && startTime.length > 0 ? new Date(startTime[0]) : undefined;
        this.endTime = endTime && endTime.length > 0 ? new Date(endTime[0]) : undefined;
        this.top = top && top.length > 0 ? Number(top[0]) : 20;
        this.skip = skip && skip.length > 0 ? Number(skip[0]) : 0;
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
            queries.push(`startTime=${this.startTime}`);
        }

        if (this.endTime !== undefined) {
            queries.push(`endTime=${this.endTime}`);
        }

        return `/event?${queries.join('&')}`;
    }
}
