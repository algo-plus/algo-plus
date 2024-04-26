let action = false;

$('#authenticate').on('click', () => {
    if (action) {
        oAuth2.begin();
    }
});

document.querySelector('.note_setting').addEventListener('click', function () {
    // GitHub 페이지로 이동하는 링크 생성
    var githubLink = `chrome-extension://${chrome.runtime.id}/link.html`;
    // 새 창에서 링크 열기
    window.open(githubLink);
});

chrome.storage.local.get('AlgoPlus_token', (data) => {
    const token = data.AlgoPlus_token;

    if (token === null || token === undefined) {
        action = true;
        $('#auth_mode').show();
    } else {
        // To validate user, load user object from GitHub.
        const AUTHENTICATION_URL = 'https://api.github.com/user';

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    /* Show MAIN FEATURES */
                    chrome.storage.local.get('mode_type', (data2) => {
                        $('#hook_mode').show();
                    });
                } else if (xhr.status === 401) {
                    // bad oAuth
                    // reset token and redirect to authorization process again!
                    chrome.storage.local.set({ AlgoPlus_token: null }, () => {
                        console.log(
                            'BAD oAuth!!! Redirecting back to oAuth process'
                        );
                        action = true;
                        $('#auth_mode').show();
                    });
                }
            }
        });
        xhr.open('GET', AUTHENTICATION_URL, true);
        xhr.setRequestHeader('Authorization', `token ${token}`);
        xhr.send();
    }
});
