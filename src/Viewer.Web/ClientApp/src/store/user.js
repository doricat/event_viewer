import authorizeService from '../services/AuthorizeService';
import { push } from 'connected-react-router';
import { actions as uiActions } from './ui';

const replaceUsers = "user_replace_all";

const initState = {
    list: [
        // {
        //     id: 0,
        //     name: "",
        //     email: "",
        //     avatar: ""
        // }
    ]
};

export const actions = {
    replaceUsers: (users) => ({ type: replaceUsers, payload: users }),
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
    }
};

export const reducer = (state = initState, action) => {
    if (action.type === replaceUsers) {
        return {
            ...state,
            list: action.payload
        };
    }

    return state;
};