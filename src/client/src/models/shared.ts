import { makeObservable, observable } from "mobx";

export type EventLevel = 'critical' | 'error' | 'warning' | 'information' | 'debug' | 'trace';
export type RequestStateType = 'waiting' | 'success' | 'failed';

export class RequestState {
    constructor(state?: RequestStateType) {
        if (state) {
            this.state = state;
        }
    }

    state: RequestStateType = 'waiting';

    static waiting(): RequestState {
        return new RequestState();
    }

    static success(): RequestState {
        return new RequestState('success');
    }

    static fail(): RequestState {
        return new RequestState('failed');
    }

    public get waiting(): boolean {
        return this.state === 'waiting';
    }

    public get success(): boolean {
        return this.state === 'success';
    }

    public get failed(): boolean {
        return this.state === 'failed';
    }

    public get completed(): boolean {
        return this.success || this.failed;
    }
}