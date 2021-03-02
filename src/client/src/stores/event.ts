import { ApplicationService } from '../services/applicationService';
import { IdGenerator } from '../infrastructure/idGenerator';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { ApplicationEvent } from '../models/entity/application';
import { Store as RootStore } from './index';
import { EventLevel } from '../models/shared';

class Store {
    constructor(private rootStore: RootStore,
        private service: ApplicationService,
        private idGenerator: IdGenerator) {
        makeObservable(this, {
            events: observable,
            loadEvents: action,
            clearEvent: action
        });
    }

    events: ApplicationEvent[] = [];
    count?: number;

    loadEvents(applicationId: number, filter: { level?: EventLevel; startTime?: Date; endTime?: Date; }, top: number, skip: number): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.getEventDetails(applicationId, {
            level: filter.level,
            startTime: filter.startTime,
            endTime: filter.endTime,
        }, top, skip, accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                x.value.forEach(y => {
                    if (this.events.findIndex(z => z.id === y.id) === -1) {
                        this.events.push(ApplicationEvent.fromApiModel(y))
                    }
                });

                this.count = x.count;
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    clearEvent(): void {
        this.events.splice(0);
        this.count = undefined;
    }
}

export { Store as EventStore };
