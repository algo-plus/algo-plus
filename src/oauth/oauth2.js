const oAuth2 = {
    init() {
        this.KEY = 'AlgoPlus_token';
        this.ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        this.AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
        this.CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;
        this.CLIENT_SECRET = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
        this.REDIRECT_URL = 'https://github.com/';
        this.SCOPES = ['repo'];
    },
    begin() {
        this.init();

        let url = `${this.AUTHORIZATION_URL}?client_id=${this.CLIENT_ID}&redirect_uri${this.REDIRECT_URL}&scope=`;

        for (let i = 0; i < this.SCOPES.length; i += 1) {
            url += this.SCOPES[i];
        }

        chrome.storage.local.set({ pipe_AlgoPlus: true }, () => {
            chrome.tabs.create({ url, selected: true }, function () {
                window.close();
                chrome.tabs.getCurrent(() => {});
            });
        });
    },
};
