import { makeObservable, observable } from 'mobx';
import { Subscription } from 'rxjs';
import { ErrorMessage, HttpErrorMessage } from '../models/entity/error';
import { HttpErrorMessageService } from "../services/httpErrorMessageService";

class Store {
    constructor(private errors: HttpErrorMessageService) {
        this.subscription = this.errors.get().subscribe((message: HttpErrorMessage) => {
            this.messages.set(message.eventId, ErrorMessage.fromMessage(message));
        });
        makeObservable(this, {
            messages: observable
        });
    }

    private subscription: Subscription;
    messages: Map<number, ErrorMessage> = new Map();
}

export { Store as ErrorStore };
