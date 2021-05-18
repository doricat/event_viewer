import { ApplicationService } from '../services/applicationService';
import { IdGenerator } from '../infrastructure/idGenerator';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Application, EventStatistics } from '../models/entity/application';
import { RootState } from './index';
import { ApplicationEditionModel } from '../models/api/application';
import { EventLevel } from '../models/shared';
import { CreatedResult } from '../models/apiResult';

class Store {
    constructor(private rootStore: RootState,
        private service: ApplicationService,
        private idGenerator: IdGenerator) {
        makeObservable(this, {
            applications: observable,
            creationResult: observable,
            loadApplications: action,
            refreshApplication: action,
            addSubscriber: action,
            removeSubscriber: action,
            saveSubscribers: action,
            createApplication: action,
            replaceApplication: action,
            deleteApplication: action
        });
    }

    applications: Application[] | null = null;
    creationResult: CreatedResult | undefined = undefined;

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
                this.applications = [];
                x.value.forEach(y => this.applications!.push(Application.fromApiModel(y)));
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
                this.getApplication(applicationId)!.eventStatistics.set(level, EventStatistics.formApiModel(x.value));
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
                this.getApplication(applicationId)?.update(x.value);
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    addSubscriber(applicationId: number, userId: number): void {
        this.getApplication(applicationId)?.addSubscriber(userId);
    }

    removeSubscriber(applicationId: number, userId: number): void {
        this.getApplication(applicationId)?.removeSubscriber(userId);
    }

    saveSubscribers(applicationId: number, subscribers: number[]): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.saveSubscribers(applicationId, subscribers, accessToken, traceId).subscribe(x => {
            if (x) {
                this.rootStore.ui.setRequestSuccess(traceId);
                const application = this.getApplication(applicationId);
                if (application) {
                    application.subscribers = subscribers;
                }
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
                this.applications!.push(application);
                this.creationResult = x.value;
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
                application!.fromApiModel(model);
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
                const index = this.applications!.findIndex(x => x.id === applicationId);
                if (index !== -1) {
                    this.applications![index].removed = true;
                }
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    getApplication(applicationId: number): Application | null {
        if (this.applications != null) {
            const index = this.applications.findIndex(x => x.id === applicationId);

            if (index !== -1) {
                return this.applications[index];
            }
        }

        return null;
    }

    removeApplication(applicationId: number): void {
        const index = this.applications!.findIndex(x => x.id === applicationId);
        if (index !== -1) {
            this.applications!.splice(index, 1);
        }
    }
}

export { Store as ApplicationStore };
