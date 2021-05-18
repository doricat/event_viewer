import { History, LocationState, createBrowserHistory } from "history";
import { createContext } from "react";
import { idGenerator } from "./infrastructure/idGenerator";
import { accountService } from "./services/accountService";
import { applicationService } from "./services/applicationService";
import { authorizeService } from "./services/authorizeService";
import { httpErrorMessageService } from "./services/httpErrorMessageService";
import { userService } from "./services/userService";
import { RootState, StoreContext } from "./stores";
import { AccountStore } from "./stores/account";
import { ApplicationStore } from "./stores/application";
import { ErrorStore } from "./stores/error";
import { EventStore } from "./stores/event";
import { RouterStore } from "./stores/router";
import { UIStore } from "./stores/ui";
import { UserStore } from "./stores/user";

class Store {
    constructor(history: History<LocationState>) {
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

export const configureStore = (history: History<LocationState>): RootState => {
    return new Store(history);
};

export const history = createBrowserHistory();
export const store = configureStore(history);
export const MyContext: StoreContext = createContext<RootState>(store);
