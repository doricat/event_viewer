import { ApplicationStore } from './application';
import { ErrorStore } from './error';
import { applicationService } from '../services/applicationService';
import { httpErrorMessageService } from '../services/httpErrorMessageService';
import { AccountStore } from './account';
import { accountService } from '../services/accountService';
import { idGenerator } from '../infrastructure/idGenerator';
import { createContext } from 'react';
import { authorizeService } from '../services/authorizeService';
import { RouterStore } from './router';
import { createBrowserHistory } from 'history';
import { UIStore } from './ui';
import { UserStore } from './user';
import { userService } from '../services/userService';
import { EventStore } from './event';

export const history = createBrowserHistory();

export class Store {
    constructor() {
        this.error = new ErrorStore(httpErrorMessageService);
        this.application = new ApplicationStore(this, applicationService, idGenerator);
        this.account = new AccountStore(this, authorizeService, accountService, idGenerator);
        this.router = new RouterStore(history);
        this.ui = new UIStore();
        this.user = new UserStore(this, userService, idGenerator);
        this.event = new EventStore(this, applicationService, idGenerator);
    }

    error: ErrorStore;
    application: ApplicationStore;
    account: AccountStore;
    router: RouterStore;
    ui: UIStore;
    user: UserStore;
    event: EventStore;
}

export const store = new Store();
export const StoreContext = createContext<Store>(store);
