import authorizeService from '../services/AuthorizeService';
import { push } from 'connected-react-router';
import { actions as uiActions } from './ui';

const replaceUsers = "user_replace_all";
const replaceCurrentUserProfiles = "user_replace_current_profiles";

const initState = {
    list: [
        // {
        //     id: 0,
        //     name: "",
        //     email: "",
        //     avatar: ""
        // }
    ],
    current: {
        profiles: undefined
        // {
        //     name: "",
        //     avatar: ""
        // }
    }
};

export const actions = {
    replaceUsers: (users) => ({ type: replaceUsers, payload: users }),
    replaceCurrentUserProfiles: (profiles) => ({ type: replaceCurrentUserProfiles, payload: profiles }),
    fetchGetUsers: () => async (dispatch) => {
        //dispatch(uiActions.setUserListLoadingState(true));

        const token = await authorizeService.getAccessToken();
        const response = await fetch("/api/accounts", {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        //dispatch(uiActions.setUserListLoadingState(false));

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
            dispatch(actions.replaceUsers(json.value));
        } else {
            if (response.status === 500) {
                dispatch(uiActions.setGlobalError(true, json.error.message));
            }
        }
    },
    fetchLoadCurrentProfiles: () => async (dispatch) => {
        const token = await authorizeService.getAccessToken();
        const response = await fetch("/api/accounts/current/profiles", {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.ok === true) {
                dispatch(actions.replaceCurrentUserProfiles(json.value));
                return;
            }

            if (response.status === 500) {
                dispatch(uiActions.setGlobalError(true, json.error.message));
                return;
            }

            console.error(json);
        } else {
            if (response.status === 401) {
                authorizeService.signOut();
                dispatch(push("/account/login"));
                return;
            }
        }
    }
};

export const reducer = (state = initState, action) => {
    if (action.type === replaceUsers) {
        return {
            ...state,
            list: action.payload
        };
    }

    if (action.type === replaceCurrentUserProfiles) {
        return {
            ...state,
            current: {
                ...state.current,
                profiles: action.payload
            }
        }
    }

    return state;
};