import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { buildJsonContentRequestHeader, buildRequestHeader } from '../infrastructure/httpHelper';
import { HttpErrorHandler } from './httpErrorHandlerService';
import { ApiResult } from '../models/apiResult';
import { HttpClient } from '../infrastructure/httpClient';
import { HandleError } from '../infrastructure/httpResponseHandler';
import { httpErrorMessageService } from './httpErrorMessageService';
import { PasswordPatchModel } from '../models/api/account';

export class AccountService {
    constructor(httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError(AccountService.name);
        this.http = new HttpClient();
    }

    private handleError: HandleError;
    private http: HttpClient;

    loadProfile(userId: number, accessToken: string, traceId: number): Observable<ApiResult<{ name: string, avatar: string }> | null> {
        return this.http.get<ApiResult<{ name: string, avatar: string }>>(`/api/accounts/${userId}/profiles`, buildJsonContentRequestHeader(accessToken))
            .pipe(catchError(this.handleError(this.loadProfile.name, traceId, null)));
    }

    replacePassword(userId: number, model: PasswordPatchModel, accessToken: string, traceId: number): Observable<boolean> {
        return this.http.patch<boolean>(`/api/accounts/${userId}/password`, buildJsonContentRequestHeader(accessToken), model)
            .pipe(catchError(this.handleError(this.replacePassword.name, traceId, false)));
    }

    replaceAvatar(userId: number, file: File, accessToken: string, traceId: number): Observable<ApiResult<string> | null> {
        const formData = new FormData();
        formData.append("file", file);
        return this.http.request<ApiResult<string>>(`/api/accounts/${userId}/profiles/avatar`, {
            method: 'PATCH',
            headers: buildRequestHeader(accessToken),
            body: formData
        }).pipe(catchError(this.handleError(this.replaceAvatar.name, traceId, null)));
    }

    replaceName(userId: number, name: string, accessToken: string, traceId: number): Observable<boolean> {
        return this.http.patch<boolean>(`/api/accounts/${userId}/profiles/name`, buildJsonContentRequestHeader(accessToken), { name })
            .pipe(catchError(this.handleError(this.replaceName.name, traceId, false)));
    }

    removeAvatar(userId: number, accessToken: string, traceId: number): Observable<ApiResult<string> | null> {
        return this.http.delete<ApiResult<string> | null>(`/api/accounts/${userId}/profiles/avatar`, buildJsonContentRequestHeader(accessToken))
            .pipe(catchError(this.handleError(this.removeAvatar.name, traceId, null)));
    }
}

export const accountService = new AccountService(new HttpErrorHandler(httpErrorMessageService));
