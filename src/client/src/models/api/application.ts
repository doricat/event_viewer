import { EventLevel } from "../shared";

export interface ApplicationCreationModel {
    name: string;
    applicationId: string;
    description?: string;
    enabled: boolean;
}

export interface ApplicationGetModel extends ApplicationCreationModel {
    id: number;
}

export interface ApplicationDetailGetModel extends ApplicationGetModel {
    eventCount: number;
    userList: number[]
}

export interface EventStatisticsGetModel {
    level: EventLevel;
    last1Hour: number;
    last24Hours: number;
    last7Days: number;
}
