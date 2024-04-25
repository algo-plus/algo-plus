import customProblemPage from '@/baekjoon/problem';
import customStatusPage from '@/baekjoon/status';
import customGlobalPage from '@/baekjoon/global';
import customSubmitPage from '@/baekjoon/submit';

const url: string = window.location.pathname;
const searchUrl: string = window.location.search;

interface LocalAuth {
    KEY: string;
    ACCESS_TOKEN_URL: string;
    AUTHORIZATION_URL: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URL: string;
    SCOPES: string[];

    init(): void;
    parseAccessCode(url: string): void;
    requestToken(code: string): void;
    finish(token: string): void;
}

export const localAuth = {
    /**
     * Initialize
     */
    init() {
        this.KEY = 'BaekjoonHub_token';
        this.ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        this.AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
        this.CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID as string;
        this.CLIENT_SECRET = process.env
            .REACT_APP_GITHUB_CLIENT_SECRET as string;
        this.REDIRECT_URL = 'https://github.com/'; // for example, https://github.com
        this.SCOPES = ['repo'];
    },

    /**
     * Parses Access Code
     */
    parseAccessCode(url: string) {
        if (url.match(/\?error=(.+)/)) {
            chrome.tabs.getCurrent(function (tab: any) {
                chrome.tabs.remove(tab.id, function () {});
            });
        } else {
            // eslint-disable-next-line
            const accessCode = url.match(/\?code=([\w\/\-]+)/);
            if (accessCode) {
                this.requestToken(accessCode[1]);
            }
        }
    },

    /**
     * Request Token
     */
    requestToken(code: string) {
        const that = this;
        const data = new FormData();
        data.append('client_id', this.CLIENT_ID);
        data.append('client_secret', this.CLIENT_SECRET);
        data.append('code', code);

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const matchResult =
                        xhr.responseText.match(/access_token=([^&]*)/);
                    that.finish(
                        typeof matchResult === 'string' ? matchResult : 'token'
                    );
                } else {
                    chrome.runtime.sendMessage({
                        closeWebPage: true,
                        isSuccess: false,
                    });
                }
            }
        });
        xhr.open('POST', this.ACCESS_TOKEN_URL, true);
        xhr.send(data);
    },

    /**
     * Finish
     */
    finish(token: string) {
        /* Get username */
        // To validate user, load user object from GitHub.
        const AUTHENTICATION_URL = 'https://api.github.com/user';

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const username = JSON.parse(xhr.responseText).login;
                    chrome.runtime.sendMessage({
                        closeWebPage: true,
                        isSuccess: true,
                        token,
                        username,
                        KEY: this.KEY,
                    });
                }
            }
        });
        xhr.open('GET', AUTHENTICATION_URL, true);
        xhr.setRequestHeader('Authorization', `token ${token}`);
        xhr.send();
    },
} as LocalAuth;

localAuth.init(); // load params.
const link = window.location.href;

/* Check for open pipe */
if (window.location.host === 'github.com') {
    chrome.storage.local.get('pipe_baekjoonhub', (data) => {
        if (data && data.pipe_baekjoonhub) {
            localAuth.parseAccessCode(link);
        }
    });
}

console.info('url=', url);

if (url.startsWith('/problem/')) {
    customProblemPage();
} else if (url.startsWith('/status') && searchUrl.startsWith('?from_mine=')) {
    customStatusPage();
} else if (url.startsWith('/submit')) {
    customSubmitPage();
}

customGlobalPage();
