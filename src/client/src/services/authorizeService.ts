import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '../infrastructure/httpClient';
import { HandleError } from '../infrastructure/httpResponseHandler';
import { HttpErrorHandler } from './httpErrorHandlerService';
import { httpErrorMessageService } from './httpErrorMessageService';
import { ApiResult } from '../models/apiResult';

export interface OidcSettings {
    authority: string;
    client_id: string;
    redirect_uri: string;
    post_logout_redirect_uri: string;
    response_type: string;
    scope: string;
}

export class AuthorizeService {
    constructor(httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError(AuthorizeService.name);
        this.http = new HttpClient();
    }

    private handleError: HandleError;
    private http: HttpClient;

    loadSettings(configurationUrl: string, traceId: number): Observable<ApiResult<OidcSettings> | null> {
        return this.http.get<ApiResult<OidcSettings>>(configurationUrl, {})
            .pipe(catchError(this.handleError(this.loadSettings.name, traceId, null)));
    }
}

const authorizeService = new AuthorizeService(new HttpErrorHandler(httpErrorMessageService));
export { authorizeService };
