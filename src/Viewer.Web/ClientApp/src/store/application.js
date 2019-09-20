import authorizeService from '../services/AuthorizeService';
import { push } from 'connected-react-router';

const replaceApplications = "application_replace_all";
const appendApplicationToList = "application_append_application_to_list";

const initState = {
    list: [
        // {
        //     id: 0,
        //     name: "",
        //     appId: "",
        //     description: "",
        //     enabled: true
        // }
    ]
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
    fetchGetApplications: () => async (dispatch) => {
        const token = await authorizeService.getAccessToken();
        const response = await fetch("/api/applications", {
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });
        const json = await response.json();
        if (response.ok === true) {
            dispatch(actions.replaceApplications(json.value));
        } else {
            if (response.status === 401) {
                authorizeService.signOut();
                dispatch(push("/account/login"));
            } else {
                // TODO
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

    return state;
};