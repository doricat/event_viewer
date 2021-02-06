import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { buildRequestHeader } from '../infrastructure/httpHelper';
import { HttpErrorHandler } from './httpErrorHandlerService';
import { ApiResult } from '../models/apiResult';
import { HttpClient } from '../infrastructure/httpClient';
import { HandleError } from '../infrastructure/httpResponseHandler';
import { httpErrorMessageService } from './httpErrorMessageService';
import { UserGetModel } from '../models/api/user';

export class UserService {
    constructor(httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError(UserService.name);
        this.http = new HttpClient();
    }

    private handleError: HandleError;
    private http: HttpClient;

    getUsers(accessToken: string, traceId: number): Observable<ApiResult<UserGetModel[]> | null> {
        return this.http.get<ApiResult<UserGetModel[]>>('/api/users', buildRequestHeader(accessToken))
            .pipe(catchError(this.handleError(this.getUsers.name, traceId, null)));
    }
}

export const userService = new UserService(new HttpErrorHandler(httpErrorMessageService));
