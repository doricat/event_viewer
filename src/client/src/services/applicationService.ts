import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { buildJsonContentRequestHeader, buildRequestHeader } from '../infrastructure/httpHelper';
import { HttpErrorHandler } from './httpErrorHandlerService';
import { ApiResult, CreatedResult, PagedResult } from '../models/apiResult';
import { HttpClient } from '../infrastructure/httpClient';
import { HandleError } from '../infrastructure/httpResponseHandler';
import { httpErrorMessageService } from './httpErrorMessageService';
import { EventLevel } from '../models/shared';
import {
    ApplicationGetModel,
    ApplicationDetailGetModel,
    EventStatisticsGetModel,
    ApplicationEditionModel
} from '../models/api/application';
import { EventGetModel } from '../models/api/event';

export class ApplicationService {
    constructor(httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError(ApplicationService.name);
        this.http = new HttpClient();
    }

    private handleError: HandleError;
    private http: HttpClient;

    getApplication(applicationId: number, accessToken: string, traceId: number): Observable<ApiResult<ApplicationDetailGetModel> | null> {
        return this.http.get<ApiResult<ApplicationDetailGetModel>>(`/api/applications/${applicationId}`, buildRequestHeader(accessToken))
            .pipe(catchError(this.handleError(this.getApplication.name, traceId, null)));
    }

    getApplications(accessToken: string, traceId: number): Observable<ApiResult<ApplicationGetModel[]> | null> {
        return this.http.get<ApiResult<ApplicationGetModel[]>>('/api/applications', buildRequestHeader(accessToken))
            .pipe(catchError(this.handleError(this.getApplications.name, traceId, null)));
    }

    saveSubscribers(applicationId: number, users: number[], accessToken: string, traceId: number): Observable<boolean> {
        return this.http.patch<boolean>(`/api/applications/${applicationId}`,
            buildJsonContentRequestHeader(accessToken), {
            userList: users
        }).pipe(catchError(this.handleError(this.saveSubscribers.name, traceId, false)));
    }

    replaceApplication(applicationId: number, model: ApplicationEditionModel, accessToken: string, traceId: number): Observable<boolean> {
        return this.http.put<boolean>(`/api/applications/${applicationId}`, buildJsonContentRequestHeader(accessToken), model)
            .pipe(catchError(this.handleError(this.replaceApplication.name, traceId, false)));
    }

    createApplication(model: ApplicationEditionModel, accessToken: string, traceId: number): Observable<ApiResult<CreatedResult> | null> {
        return this.http.post<ApiResult<CreatedResult>>('/api/applications', buildJsonContentRequestHeader(accessToken), model)
            .pipe(catchError(this.handleError(this.createApplication.name, traceId, null)));
    }

    deleteApplication(applicationId: number, accessToken: string, traceId: number): Observable<boolean> {
        return this.http.delete<boolean>(`/api/applications/${applicationId}`, buildRequestHeader(accessToken))
            .pipe(catchError(this.handleError(this.deleteApplication.name, traceId, false)));
    }

    getEventStatistics(applicationId: number, level: EventLevel, accessToken: string, traceId: number): Observable<ApiResult<EventStatisticsGetModel> | null> {
        return this.http.get<ApiResult<EventStatisticsGetModel>>(`/api/applications/${applicationId}/events/statistics/${level}`, buildRequestHeader(accessToken))
            .pipe(catchError(this.handleError(this.getEventStatistics.name, traceId, null)));
    }

    getEventDetails(applicationId: number, filter: FilterDTO, top: number, skip: number, accessToken: string, traceId: number): Observable<PagedResult<EventGetModel[]> | null> {
        return this.http.get<PagedResult<EventGetModel[]>>(`/api/applications/${applicationId}/events?$filter=${this.buildFilter(filter)}&$top=${top}&$skip=${skip}`,
            buildRequestHeader(accessToken)).pipe(catchError(this.handleError(this.getEventDetails.name, traceId, null)));
    }

    updateMonitorSettings(connectionId: string, applicationId: number, level: string, accessToken: string, traceId: number): Observable<boolean> {
        return this.http.patch<boolean>(`/api/monitor_settings/${connectionId}`, buildJsonContentRequestHeader(accessToken),
            {
                applicationId,
                level
            }).pipe(catchError(this.handleError(this.updateMonitorSettings.name, traceId, false)));
    }

    private buildFilter(filter: FilterDTO): string {
        const filters: string[] = [];
        if (filter.level) {
            filters.push(`level eq '${filter.level}'`);
        }

        if (filter.startTime) {
            filters.push(`timestamp ge '${filter.startTime.toLocaleDateString('zh-cn')} ${filter.startTime.toLocaleTimeString('en-GB')}'`);
        }

        if (filter.endTime) {
            filters.push(`timestamp le '${filter.endTime.toLocaleDateString('zh-cn')} ${filter.endTime.toLocaleTimeString('en-GB')}'`);
        }

        return filters.join(' and ');
    };
}

export interface FilterDTO {
    level?: EventLevel;
    startTime?: Date;
    endTime?: Date;
}

export const applicationService = new ApplicationService(new HttpErrorHandler(httpErrorMessageService));
