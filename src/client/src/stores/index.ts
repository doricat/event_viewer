import { AccountStore } from './account';
import { accountService } from '../services/accountService';
import { idGenerator } from '../infrastructure/idGenerator';
import { createContext } from 'react';
import { authorizeService } from '../services/authorizeService';
import { createBrowserHistory } from 'history';
import { UIStore } from './ui';

export const history = createBrowserHistory();

export class Store {
    constructor() {
        this.account = new AccountStore(this, authorizeService, accountService, idGenerator);
        this.ui = new UIStore();
    }

    account: AccountStore;
    ui: UIStore;
}

export const store = new Store();
export const StoreContext = createContext<Store>(store);
