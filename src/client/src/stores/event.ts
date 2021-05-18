import { ApplicationService } from '../services/applicationService';
import { IdGenerator } from '../infrastructure/idGenerator';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { ApplicationEvent } from '../models/entity/application';
import { RootState } from './index';
import { EventLevel } from '../models/shared';

class Store {
    constructor(private rootStore: RootState,
        private service: ApplicationService,
        private idGenerator: IdGenerator) {
        makeObservable(this, {
            events: observable,
            loadEvents: action,
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

    updateMonitorSettings(connectionId: string, applicationId: number, level: string): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.updateMonitorSettings(connectionId, applicationId, level, accessToken, traceId).subscribe(x => {
            if (x) {
                this.rootStore.ui.setRequestSuccess(traceId);
            } else {
                this.rootStore.ui.setRequestFailed(traceId);
            }
        });

        return traceId;
    }
}

export { Store as EventStore };
