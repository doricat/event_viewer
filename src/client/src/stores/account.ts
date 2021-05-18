import { UserManager, WebStorageStateStore, User, UserManagerSettings, SignoutResponse } from 'oidc-client';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { IdGenerator } from '../infrastructure/idGenerator';
import { AuthorizeService, OidcSettings } from '../services/authorizeService';
import { ApplicationName, ApplicationPaths } from '../infrastructure/apiAuthorizationConstants';
import { RootState } from './index';
import { AccountService } from '../services/accountService';
import { PasswordPatchModel } from '../models/api/account';

export class Store {
    constructor(private rootStore: RootState,
        private authorizeService: AuthorizeService,
        private accountService: AccountService,
        private idGenerator: IdGenerator) {
        makeObservable(this, {
            user: observable,
            profile: observable,
            loadOidcSettings: action,
            changePassword: action,
            changeAvatar: action,
            changeName: action,
            removeAvatar: action,
            isAuthenticated: computed
        });
    }

    userManagerSettings: UserManagerSettings = {};
    user?: User;
    userManager?: UserManager;
    accessToken = '';
    profile = {
        userId: 0,
        name: '',
        avatar: ''
    };

    loadOidcSettings(): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);

        if (this.userManager !== undefined) {
            this.rootStore.ui.setRequestSuccess(traceId);
            return traceId;
        }

        this.authorizeService.loadSettings(ApplicationPaths.ApiAuthorizationClientConfigurationUrl, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(async () => {
                this.generateSettings(x.value);
                this.userManager = new UserManager(this.userManagerSettings);
                this.userManager.events.addUserSignedOut(async () => {
                    await this.userManager!.removeUser();
                    this.user = undefined;
                });
                const user = await this.userManager.getUser();
                if (user !== null) {
                    this.accessToken = user.access_token;
                    this.profile.userId = Number(user.profile.sub);
                    this.user = user;
                }

                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    signIn(returnUrl: string): number {
        if (this.userManager === undefined) {
            throw new Error();
        }

        const traceId = this.idGenerator.getNext();
        this.userManager.signinRedirect({ useReplaceToNavigate: true, data: { returnUrl } })
            .then(() => {
                this.rootStore.ui.setSignRedirect(traceId);
            })
            .catch((error: Error) => {
                this.rootStore.ui.setSignFail(traceId, error.message);
            });

        return traceId;
    }

    completeSignIn(url: string): number {
        if (this.userManager === undefined) {
            throw new Error();
        }

        const traceId = this.idGenerator.getNext();
        this.userManager.signinCallback(url).then(user => {
            runInAction(() => {
                this.user = user;
                this.accessToken = user.access_token;
                this.profile.userId = Number(user.profile.sub);
                this.rootStore.ui.setSignSuccess(traceId, user.state.returnUrl as string);

            });
        }).catch((error: Error) => {
            this.rootStore.ui.setSignFail(traceId, error.message);
        });

        return traceId;
    }

    signOut(returnUrl: string): number {
        if (this.userManager === undefined) {
            throw new Error();
        }

        const traceId = this.idGenerator.getNext();
        this.userManager.signoutRedirect({ useReplaceToNavigate: true, data: { returnUrl } })
            .then(() => {
                this.rootStore.ui.setSignRedirect(traceId);
            })
            .catch((error: Error) => {
                this.rootStore.ui.setSignFail(traceId, error.message);
            });

        return traceId;
    }

    completeSignOut(url: string): number {
        if (this.userManager === undefined) {
            throw new Error();
        }

        const traceId = this.idGenerator.getNext();
        this.userManager.signoutCallback(url).then(response => {
            runInAction(() => {
                this.user = undefined;
                this.rootStore.ui.setSignSuccess(traceId, (response as SignoutResponse).state.returnUrl as string);
            });
        }).catch((error: Error) => {
            this.rootStore.ui.setSignFail(traceId, error.message);
        });

        return traceId;
    }

    loadProfile(): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        this.accountService.loadProfile(this.profile.userId, this.accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.profile.name = x.value.name;
                this.profile.avatar = x.value.avatar;
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    changePassword(model: PasswordPatchModel): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        this.accountService.replacePassword(this.profile.userId, model, this.accessToken, traceId).subscribe(x => {
            if (x) {
                this.rootStore.ui.setRequestSuccess(traceId);
            } else {
                this.rootStore.ui.setRequestFailed(traceId);
            }
        });

        return traceId;
    }

    changeAvatar(file: File): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        this.accountService.replaceAvatar(this.profile.userId, file, this.accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.profile.avatar = x.value;
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    changeName(name: string): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        this.accountService.replaceName(this.profile.userId, name, this.accessToken, traceId).subscribe(x => {
            if (x === false) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.profile.name = name;
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    removeAvatar(): number {
        const traceId = this.idGenerator.getNext();
        this.rootStore.ui.setRequestWaiting(traceId);
        this.accountService.removeAvatar(this.profile.userId, this.accessToken, traceId).subscribe(x => {
            if (x == null) {
                this.rootStore.ui.setRequestFailed(traceId);
                return;
            }

            runInAction(() => {
                this.profile.avatar = x.value;
                this.rootStore.ui.setRequestSuccess(traceId);
            });
        });

        return traceId;
    }

    get isAuthenticated(): boolean {
        return this.user !== undefined && this.user.profile !== undefined;
    }

    private generateSettings(settings: OidcSettings): void {
        this.userManagerSettings = {
            authority: settings.authority,
            client_id: settings.client_id,
            redirect_uri: settings.redirect_uri,
            post_logout_redirect_uri: settings.post_logout_redirect_uri,
            response_type: settings.response_type,
            scope: settings.scope,
            automaticSilentRenew: true,
            includeIdTokenInSilentRenew: true,
            userStore: new WebStorageStateStore({
                prefix: ApplicationName
            })
        }
    }
}

export { Store as AccountStore };
