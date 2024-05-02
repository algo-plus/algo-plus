function addUrlSearchParam(url: string, param: string, value: string): string {
    const _url = new URL(url);
    const searchParams = _url.searchParams;
    searchParams.set(param, value);
    return _url.origin + _url.pathname + _url.search;
}

function refreshUrl(url: string) {
    location.href = url;
}

function getUrlSearchParam(url: string, param: string): string | null {
    return new URL(url).searchParams.get(param);
}

export { addUrlSearchParam, refreshUrl, getUrlSearchParam };
