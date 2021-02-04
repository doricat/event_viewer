import {
    ApplicationEditionModel,
    ApplicationDetailGetModel,
    ApplicationGetModel,
    EventStatisticsGetModel
} from "../api/application";
import { EventGetModel } from "../api/event";
import { EventLevel } from "../shared";

export class EventStatistics {
    last1Hour!: number;
    last24Hours!: number;
    last7Days!: number;

    static formApiModel(model: EventStatisticsGetModel): EventStatistics {
        const o = new EventStatistics();
        o.last1Hour = model.last1Hour;
        o.last24Hours = model.last24Hours;
        o.last7Days = model.last7Days;
        return o;
    }
}

export class Application {
    id!: number;
    name!: string;
    applicationId!: string;
    description?: string;
    enabled!: boolean;
    events?: number;
    subscribers: number[] = [];
    eventStatistics?: Map<EventLevel, EventStatistics>;

    static fromApiModel(model: ApplicationGetModel): Application {
        const application = new Application();
        application.id = model.id;
        application.fromApiModel(model);
        return application;
    }

    fromApiModel(model: ApplicationEditionModel): void {
        this.name = model.name;
        this.applicationId = model.applicationId;
        this.description = model.description;
        this.enabled = model.enabled;
    }

    update(model: ApplicationDetailGetModel): void {
        this.fromApiModel(model);
        this.events = model.eventCount;
        this.subscribers = model.userList;
    }

    addSubscriber(userId: number): void {
        if (this.subscribers.findIndex(x => x === userId) !== -1) {
            return;
        }

        this.subscribers.push(userId);
    }

    removeSubscriber(userId: number): void {
        const index = this.subscribers.findIndex(x => x === userId);
        if (index === -1) {
            return;
        }

        this.subscribers.splice(index, 1);
    }
}

export class ApplicationEvent {
    applicationId!: number;
    category!: string;
    level!: string;
    message!: string;
    timestamp!: Date;

    static fromApiModel(model: EventGetModel): ApplicationEvent {
        const o = new ApplicationEvent();
        o.applicationId = model.applicationId;
        o.category = model.category;
        o.level = model.level;
        o.message = model.message;
        o.timestamp = model.timestamp;
        return o;
    }
}
