const localAuth = {
    init() {
        this.KEY = 'AlgoPlus_token';
        this.ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        this.AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
        this.CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
        this.CLIENT_SECRET = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
        this.REDIRECT_URL = 'https://github.com/';
        this.SCOPES = ['repo'];
    },

    parseAccessCode(url) {
        if (url.match(/\?error=(.+)/)) {
            chrome.tabs.getCurrent((tab) => {
                chrome.tabs.remove(tab.id);
            });
        } else {
            const accessCode = url.match(/\?code=([\w\/\-]+)/);
            if (accessCode) {
                this.requestToken(accessCode[1]);
            }
        }
    },
    requestToken(code) {
        const that = this;
        const data = new FormData();
        data.append('client_id', this.CLIENT_ID);
        data.append('client_secret', this.CLIENT_SECRET);
        data.append('code', code);

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    that.finish(
                        xhr.responseText.match(/access_token=([^&]*)/)[1]
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

    finish(token) {
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
};

localAuth.init();
const link = window.location.href;

if (window.location.host === 'github.com') {
    chrome.storage.local.get('pipe_AlgoPlus', (data) => {
        if (data && data.pipe_AlgoPlus) {
            localAuth.parseAccessCode(link);
        }
    });
}
