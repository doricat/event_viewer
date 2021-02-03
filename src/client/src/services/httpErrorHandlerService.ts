import { Observable, of } from 'rxjs';
import { ResponseContext } from '../models/httpResponse';
import { HttpErrorMessageService } from './httpErrorMessageService';

export class HttpErrorHandler {
    constructor(private messageService: HttpErrorMessageService) { }

    createHandleError = (serviceName: string) => {
        return <T>(operation: string, eventId: number, result = {} as T) => this.handleError(serviceName, operation, eventId, result);
    }

    handleError<T>(serviceName: string, operation: string, eventId: number, result = {} as T): (context: ResponseContext) => Observable<T> {
        return (context: ResponseContext): Observable<T> => {
            this.messageService.add({
                serviceName,
                operation,
                httpStatus: context.status,
                data: context.data,
                headers: context.headers,
                eventId: eventId
            });

            return of(result);
        };
    }
}
