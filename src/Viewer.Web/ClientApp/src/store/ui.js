const fixNavMenu = "ui_fix_nav_menu";
const unfixNavMenu = "ui_unfix_nav_menu";
const setApplicationListLoadingState = "ui_set_application_list_loading_state";
const setGlobalError = "ui_set_global_error";
const closeGlobalErrorMessageBox = "ui_close_global_error_message_box";

const initState = {
    navMenuFixed: false,
    applicationListLoadingState: false,
    globalErrorModal: {
        show: false,
        message: null
    }
};

export const actions = {
    fixNavMenu: () => ({ type: fixNavMenu }),
    unfixNavMenu: () => ({ type: unfixNavMenu }),
    setApplicationListLoadingState: (state) => ({ type: setApplicationListLoadingState, payload: state }),
    setGlobalError: (show, message) => ({ type: setGlobalError, payload: { show, message } }),
    closeGlobalErrorMessageBox: () => ({ type: closeGlobalErrorMessageBox })
};

export const reducer = (state = initState, action) => {
    if (action.type === fixNavMenu) {
        return { ...state, navMenuFixed: true };
    }

    if (action.type === unfixNavMenu) {
        return { ...state, navMenuFixed: false };
    }

    if (action.type === setApplicationListLoadingState) {
        return { ...state, applicationListLoadingState: action.payload };
    }

    if (action.type === setGlobalError) {
        return { ...state, globalErrorModal: action.payload };
    }

    if (action.type === closeGlobalErrorMessageBox) {
        return { ...state, globalErrorModal: { show: false, message: null } };
    }

    return state;
};