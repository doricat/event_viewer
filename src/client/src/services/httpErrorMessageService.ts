import { Observable, Subject } from 'rxjs';
import { HttpErrorMessage } from '../models/entity/error';

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
