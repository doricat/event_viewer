import { action, makeObservable, observable, runInAction } from 'mobx';
import { IdGenerator } from '../infrastructure/idGenerator';
import { User } from '../models/entity/account';
import { UserService } from '../services/userService';
import { RootState } from './index';

class Store {
    constructor(private rootStore: RootState,
        private service: UserService,
        private idGenerator: IdGenerator) {
        makeObservable(this, {
            users: observable,
            loadUsers: action
        });
    }

    users: User[] = [];

    loadUsers(): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        const accessToken = this.rootStore.account.accessToken;
        this.service.getUsers(accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.users.splice(0);
                x.value.forEach(y => this.users.push(User.fromApiModel(y)));
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }
}

export { Store as UserStore };
