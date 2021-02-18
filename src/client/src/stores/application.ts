import { ApplicationService } from '../services/applicationService';
import { IdGenerator } from '../infrastructure/idGenerator';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Application, EventStatistics } from '../models/entity/application';
import { Store as RootStore } from './index';
import { ApplicationEditionModel } from '../models/api/application';
import { EventLevel } from '../models/shared';

class Store {
    constructor(private rootStore: RootStore,
        private service: ApplicationService,
        private idGenerator: IdGenerator) {
        makeObservable(this, {
            applications: observable,
            loadApplications: action,
            refreshApplication: action,
            addSubscriber: action,
            removeSubscriber: action,
            pushSubscribers: action,
            createApplication: action,
            replaceApplication: action,
            deleteApplication: action
        });
    }

    applications: Application[] = [];

    loadApplications(): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.getApplications(accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.applications.splice(0);
                x.value.forEach(y => this.applications.push(Application.fromApiModel(y)));
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    loadEventStatistics(applicationId: number, level: EventLevel): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.getEventStatistics(applicationId, level, accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.getApplication(applicationId).eventStatistics.set(level, EventStatistics.formApiModel(x.value));
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    refreshApplication(applicationId: number): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.getApplication(applicationId, accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.getApplication(applicationId).update(x.value);
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    addSubscriber(applicationId: number, userId: number): void {
        this.getApplication(applicationId).addSubscriber(userId);
    }

    removeSubscriber(applicationId: number, userId: number): void {
        this.getApplication(applicationId).removeSubscriber(userId);
    }

    pushSubscribers(applicationId: number): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const application = this.getApplication(applicationId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.saveSubscribers(applicationId, application.subscribers, accessToken, traceId).subscribe(x => {
            if (x) {
                this.rootStore.ui.setRequestSuccess(traceId);
            } else {
                this.rootStore.ui.setRequestFailed(traceId);
            }
        });

        return traceId;
    }

    createApplication(model: ApplicationEditionModel): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.createApplication(model, accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                const application = new Application();
                application.id = x.value.id;
                application.fromApiModel(model);
                this.applications.push(application);
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    replaceApplication(applicationId: number, model: ApplicationEditionModel): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.replaceApplication(applicationId, model, accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                const application = this.getApplication(applicationId);
                application.fromApiModel(model);
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    deleteApplication(applicationId: number): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.deleteApplication(applicationId, accessToken, traceId).subscribe(x => {
            if (x === false) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                const index = this.applications.findIndex(x => x.id === applicationId);
                if (index === -1) return;
                this.applications.splice(index, 1);
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    getApplication(applicationId: number): Application {
        const index = this.applications.findIndex(x => x.id === applicationId);
        if (index === -1) {
            throw new Error();
        }

        return this.applications[index];
    }
}

export { Store as ApplicationStore };
