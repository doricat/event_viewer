import { ApplicationStore } from './application';
import { ErrorStore } from './error';
import { AccountStore } from './account';
import { RouterStore } from './router';
import { UIStore } from './ui';
import { UserStore } from './user';
import { EventStore } from './event';

export type RootState = {
    error: ErrorStore;
    application: ApplicationStore;
    account: AccountStore;
    router: RouterStore;
    ui: UIStore;
    user: UserStore;
    event: EventStore;
};

export type StoreContext = React.Context<RootState>;
