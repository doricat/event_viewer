export class AuthorizeService {
    _callbacks = [];
    _nextSubscriptionId = 0;
    _user = null;
    _isAuthenticated = false;
    _token = null;

    constructor() {
        const token = localStorage.getItem("accessToken");
        this._token = token;
        if (token) {
            this._user = JSON.parse(window.atob(token.split(".")[1]));
            this._isAuthenticated = !!this._user;
        }
    }

    isAuthenticated() {
        return this._isAuthenticated;
    }

    getUser() {
        return this._user;
    }

    getRoles() {
        const result = [];
        if (this._user && this._user.role) {
            result.push(this._user.role);
            return result;
        }

        return result;
    }

    getAccessToken() {
        return this._token;
    }

    async signIn(state) {
        let response = await fetch("/api/tokens",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: state.email,
                    password: state.password
                })
            });

        const json = await response.json();
        if (response.ok === true) {
            // {value: token}
            this._token = json.value;

            localStorage.removeItem("accessToken");
            if (state.rememberMe === true) {
                localStorage.setItem("accessToken", json.value);
            }

            const user = JSON.parse(window.atob(json.value.split(".")[1]));
            this.updateState(user);

            return { succeeded: true };
        } else {
            // {
            //     code: "",
            //     message: ""
            // }
            return { succeeded: false, apiResult: json };
        }
    }

    signOut() {
        this._token = null;
        localStorage.removeItem("accessToken");
        this.updateState(null);
    }

    updateState(user) {
        this._user = user;
        this._isAuthenticated = !!this._user;
        this.notifySubscribers();
    }

    subscribe(callback) {
        this._callbacks.push({ callback, subscription: this._nextSubscriptionId++ });
        return this._nextSubscriptionId - 1;
    }

    unsubscribe(subscriptionId) {
        const subscriptionIndex = this._callbacks
            .map((element, index) => element.subscription === subscriptionId ? { found: true, index } : { found: false })
            .filter(element => element.found === true);
        if (subscriptionIndex.length !== 1) {
            throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
        }

        this._callbacks = this._callbacks.splice(subscriptionIndex[0].index, 1);
    }

    notifySubscribers() {
        for (let i = 0; i < this._callbacks.length; i++) {
            const callback = this._callbacks[i].callback;
            callback();
        }
    }
}

const authService = new AuthorizeService();
export default authService;