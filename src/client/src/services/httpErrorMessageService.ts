import { Observable, Subject } from 'rxjs';

export interface HttpErrorMessage {
    serviceName: string;
    operation: string;
    httpStatus: number;
    data: any;
    headers: Headers;
    eventId: number;
}

export class HttpErrorMessageService {
    private subject = new Subject<HttpErrorMessage>();

    add(message: HttpErrorMessage): void {
        this.subject.next(message);
    }

    get(): Observable<HttpErrorMessage> {
        return this.subject.asObservable();
    }
}

export const httpErrorMessageService = new HttpErrorMessageService();
