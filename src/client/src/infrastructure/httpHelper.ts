function buildRequestHeader(accessToken: string): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    headers['Authorization'] = `Bearer ${accessToken}`;
    headers['X-Requested-With'] = 'XMLHttpRequest';

    return headers;
}

function buildJsonContentRequestHeader(accessToken: string): { [key: string]: string } {
    const headers = buildRequestHeader(accessToken);
    headers['Content-Type'] = 'application/json';

    return headers;
}

export {
    buildJsonContentRequestHeader,
    buildRequestHeader
};
