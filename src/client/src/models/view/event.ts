import { makeObservable, observable } from 'mobx';
import { EventLevel } from '../shared';

export class FilterModel {
    constructor(level?: EventLevel, startTime?: Date, endTime?: Date) {
        this.level = level;
        this.startTime = startTime;
        this.endTime = endTime;

        makeObservable(this, {
            level: observable,
            startTime: observable,
            endTime: observable
        })
    }

    level?: EventLevel | 'all';
    startTime?: Date;
    endTime?: Date;

    toFilter() {
        return {
            level: this.level === 'all' ? undefined : this.level,
            startTime: this.startTime,
            endTime: this.endTime
        }
    }
}
