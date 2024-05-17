const localAuth = {
    init() {
        this.KEY = 'AlgoPlus_token';
        this.ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        this.AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
        this.CLIENT_ID = 'Ov23liebEEJHz6LWjLOY'
        this.CLIENT_SECRET = 'a340c9c116a31b3cd4218c7bae3df75ae28090d5'
        this.REDIRECT_URL = 'https://github.com/';
        this.SCOPES = ['repo'];
    },

    parseAccessCode(url) {
        // error= 부분이 있는지를 확인 && 있다면 현재 탭 닫기
        if (url.match(/\?error=(.+)/)) {
            chrome.tabs.getCurrent((tab) => {
                chrome.tabs.remove(tab.id);
            });
        }
        // 액세스 코드 추출 && 사용자 식별
        else {
            const accessCode = url.match(/\?code=([\w\/\-]+)/);
            accessCode && this.requestToken(accessCode[1]);
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
                    that.setHeader(
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

    setHeader(token) {
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

/*
파이프 체크 후 Auth 활성화
*/
if (window.location.host === 'github.com') {
    chrome.storage.local.get('pipe_AlgoPlus', (data) => {
        if (data && data.pipe_AlgoPlus) {
            localAuth.parseAccessCode(link);
        }
    });
}
