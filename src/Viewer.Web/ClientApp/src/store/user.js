import authorizeService from '../services/AuthorizeService';
import { push } from 'connected-react-router';
import { actions as uiActions } from './ui';

const replaceCurrentUserProfiles = "user_replace_current_profiles";

const initState = {
    current: {
        profiles: undefined
        // {
        //     name: "",
        //     avatar: ""
        // }
    }
};

export const actions = {
    replaceCurrentUserProfiles: (profiles) => ({ type: replaceCurrentUserProfiles, payload: profiles }),
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