import authorizeService from '../services/AuthorizeService';
import { push } from 'connected-react-router';
import { actions as uiActions } from './ui';

const replaceApplications = "application_replace_all";
const appendApplicationToList = "application_append_application_to_list";
const replaceApplicationDetail = "application_replace_detail";

const initState = {
    list: [
        // {
        //     id: 0,
        //     name: "",
        //     appId: "",
        //     description: "",
        //     enabled: true
        // }
    ],
    detail: null
};

export const actions = {
    replaceApplications: (list) => {
        return {
            type: replaceApplications,
            payload: {
                list: list
            }
        };
    },
    appendApplicationToList: (app) => {
        return {
            type: appendApplicationToList,
            payload: app
        };
    },
    replaceApplicationDetail: (app) => {
        return {
            type: replaceApplicationDetail,
            payload: app
        };
    },
    fetchGetApplications: (callback) => async (dispatch) => {
        const token = await authorizeService.getAccessToken();
        const response = await fetch("/api/applications", {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        callback();

        if (response.status === 401) {
            authorizeService.signOut();
            dispatch(push("/account/login"));
            return;
        }

        const json = await response.json();
        if (response.ok === true) {
            dispatch(actions.replaceApplications(json.value));
        } else {
            if (response.status === 500) {
                dispatch(uiActions.setGlobalError(true, json.error.message));
            }
        }
    },
    fetchCreateApplication: (app, badRequestCallback, navCallback) => async (dispatch) => {
        const token = await authorizeService.getAccessToken();
        let headers = !token ? {} : { "Authorization": `Bearer ${token}` };
        headers["Content-Type"] = "application/json";

        const response = await fetch("/api/applications",
            {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    id: app.appId,
                    name: app.appName,
                    description: app.description,
                    enabled: app.enabled
                })
            });

        if (response.status === 401) {
            authorizeService.signOut();
            dispatch(push("/account/login"));
            return;
        }

        if (response.status === 403) {
            dispatch(push("/unauthorized"));
            return;
        }

        const json = await response.json();
        if (response.ok === true) {
            dispatch(actions.appendApplicationToList({
                ...app,
                id: json.value.id,
                name: app.appName,
            }));

            if (navCallback) {
                navCallback();
            } else {
                dispatch(push("/application"));
            }
        } else {
            if (response.status === 400) {
                badRequestCallback(json.error);
                return;
            }

            if (response.status === 500) {
                dispatch(uiActions.setGlobalError(true, json.error.message));
            }
        }
    },
    fetchLoadApplicationDetail: (id, callback) => async (dispatch) => {
        const token = await authorizeService.getAccessToken();
        const response = await fetch(`/api/applications/${id}`, {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        callback();

        if (response.status === 401) {
            authorizeService.signOut();
            dispatch(push("/account/login"));
            return;
        }

        if (response.status === 404) {
            dispatch(push("/404"));
            return;
        }

        const json = await response.json();
        if (response.ok === true) {
            dispatch(actions.replaceApplicationDetail({
                ...json.value,
                appName: json.value.name
            }));
        } else {
            if (response.status === 500) {
                dispatch(uiActions.setGlobalError(true, json.error.message));
            }
        }
    }
};

export const reducer = (state = initState, action) => {
    if (action.type === replaceApplications) {
        return {
            ...state,
            list: action.payload.list
        };
    }

    if (action.type === appendApplicationToList) {
        return {
            ...state,
            list: [
                ...state.list,
                action.payload
            ]
        };
    }

    if (action.type === replaceApplicationDetail) {
        return {
            ...state,
            detail: action.payload
        };
    }

    return state;
};