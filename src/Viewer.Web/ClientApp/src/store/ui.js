const fixNavMenu = "fix_nav_menu";
const unfixNavMenu = "unfix_nav_menu";
const initState = {
    navMenuFixed: false
};

export const actions = {
    fixNavMenu: () => ({ type: fixNavMenu }),
    unfixNavMenu: () => ({ type: unfixNavMenu })
};

export const reducer = (state = initState, action) => {
    if (action.type === fixNavMenu) {
        return { ...state, navMenuFixed: true };
    }

    if (action.type === unfixNavMenu) {
        return { ...state, navMenuFixed: false };
    }

    return state;
};