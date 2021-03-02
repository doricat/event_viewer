export const getReturnUrl = (paramName: string, search: string, origin: string) => {
    const params = new URLSearchParams(search);
    const fromQuery = params.get(paramName);
    if (fromQuery && !fromQuery.startsWith(`${origin}/`)) {
        throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
    }
    return fromQuery || `${origin}/`;
};
