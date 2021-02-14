import { action, makeObservable, observable } from 'mobx';
import { AuthenticationResultStatus } from '../infrastructure/apiAuthorizationConstants';
import { RequestState } from '../models/shared';

interface SignState {
    message?: string;
    returnUrl?: string;
}

class Store {
    constructor() {
        makeObservable(this, {
            requestStates: observable,
            signState: observable,
            setRequestWaiting: action,
            setRequestSuccess: action,
            setRequestFailed: action,
            setSignRedirect: action,
            setSignFail: action,
            setSignSuccess: action
        });
    }

    requestStates: Map<number, RequestState> = new Map();
    signState: Map<number, [string, SignState]> = new Map();

    setRequestWaiting(traceId: number): void {
        this.requestStates.set(traceId, 'waiting');
    }

    setRequestSuccess(traceId: number): void {
        this.requestStates.set(traceId, 'success');
    }

    setRequestFailed(traceId: number): void {
        this.requestStates.set(traceId, 'failed');
    }

    setSignRedirect(traceId: number): void {
        this.signState.set(traceId, [AuthenticationResultStatus.Redirect, {}]);
    }

    setSignFail(traceId: number, message: string): void {
        this.signState.set(traceId, [AuthenticationResultStatus.Fail, { message }]);
    }

    setSignSuccess(traceId: number, returnUrl: string): void {
        this.signState.set(traceId, [AuthenticationResultStatus.Success, { returnUrl }]);
    }
}

export { Store as UIStore };
