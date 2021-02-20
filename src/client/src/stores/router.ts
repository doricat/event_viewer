import { History, Location } from 'history';
import { makeObservable, observable, runInAction, action } from 'mobx';

class Store {
    constructor(private history: History) {
        this.location = history.location;
        this.action = history.action;

        makeObservable(this, {
            location: observable,
            action: observable,
            query: observable,
            changeLocation: action
        });
    }

    location: Location;
    action: string;
    query: Map<string, string[]> | undefined = undefined;

    changeLocation(location: Location, action: string, isFirstRendering: boolean): void {
        if (isFirstRendering) {
            return;
        }

        runInAction(() => {
            this.location = location;
            this.query = this.injectQuery(location);
            this.action = action;
        });
    }

    push(path: string, state?: any): void {
        this.history.push(path, state);
    }

    replace(path: string, state?: any): void {
        this.history.replace(path, state);
    }

    go(): void {
        this.history.go(1);
    }

    goBack(): void {
        this.history.goBack();
    }

    goForward(): void {
        this.history.goForward();
    }

    private injectQuery(location: Location): Map<string, string[]> | undefined {
        if (this.query !== undefined) {
            return undefined;
        }

        const searchString = location.search;
        if (searchString.length === 0) {
            return undefined;
        }

        const search = searchString.substring(1);
        const queries = search.split('&');
        const query = queries.reduce((acc, currentQuery) => {
            const [key, value] = currentQuery.split('=');
            if (acc.has(key)) {
                const values = acc.get(key) ?? [] as string[];
                values.push(value);
                acc.set(key, values);
            } else {
                acc.set(key, [value]);
            }

            return acc;
        }, new Map() as Map<string, string[]>);

        return query;
    }
}

export { Store as RouterStore };
