const oAuth2 = {
    init() {
        this.KEY = 'AlgoPlus_token';
        this.ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        this.AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
        this.CLIENT_ID = 'Ov23liebEEJHz6LWjLOY'
        this.CLIENT_SECRET = 'a340c9c116a31b3cd4218c7bae3df75ae28090d5'
        this.REDIRECT_URL = 'https://github.com/';
        this.SCOPES = ['repo'];
    },
    begin() {
        this.init();

        let url = `${this.AUTHORIZATION_URL}?client_id=${this.CLIENT_ID}&redirect_uri${this.REDIRECT_URL}&scope=`;

        for (const scope of this.SCOPES) {
            url += scope;
        }

        chrome.storage.local.set({ pipe_AlgoPlus: true }, () => {
            chrome.tabs.create({ url, selected: true }, () => {
                window.close();
                chrome.tabs.getCurrent(() => {});
            });
        });
    },
};
