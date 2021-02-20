import { makeObservable, observable } from 'mobx';
import { Subscription } from 'rxjs';
import { ErrorMessage, HttpErrorMessage } from '../models/entity/error';
import { HttpErrorMessageService } from "../services/httpErrorMessageService";

class Store {
    constructor(private errors: HttpErrorMessageService) {
        this.subscription = this.errors.get().subscribe((message: HttpErrorMessage) => {
            const errorMessage = ErrorMessage.fromMessage(message);
            if (errorMessage.isServerSideException) {
                this.exceptionMessage.push(errorMessage);
            } else if (errorMessage.isUnauthorized) {
                this.unauthorizedMessage.push(errorMessage);
            } else if (errorMessage.isUnauthenticated) {
                this.unauthenticatedMessage.push(errorMessage);
            } else {
                this.operationFailedMessage.set(message.eventId, errorMessage);
            }
        });

        makeObservable(this, {
            exceptionMessage: observable,
            unauthorizedMessage: observable,
            unauthenticatedMessage: observable,
            operationFailedMessage: observable
        });
    }

    private subscription: Subscription;
    exceptionMessage: ErrorMessage[] = [];
    unauthorizedMessage: ErrorMessage[] = [];
    unauthenticatedMessage: ErrorMessage[] = [];
    operationFailedMessage: Map<number, ErrorMessage> = new Map();
}

export { Store as ErrorStore };
