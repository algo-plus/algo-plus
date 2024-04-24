/**
 * solvedac 문제 데이터를 파싱해오는 함수.
 */
async function SolvedApiCall(problemId: number) {
    return fetch(
        `https://solved.ac/api/v3/problem/show?problemId=${problemId}`,
        { method: 'GET' }
    ).then((query) => query.json());
}

function handleMessage(request: any, sender: any, sendResponse: any) {
    if (
        request &&
        request.closeWebPage === true &&
        request.isSuccess === true
    ) {
        /* Set username */
        chrome.storage.local.set({ AlgoPlus_username: request.username });

        /* Set token */
        chrome.storage.local.set({ AlgoPlus_token: request.token });

        /* Close pipe */
        chrome.storage.local.set({ pipe_AlgoPlus: false }, () => {
            console.log('Closed pipe.');
        });

        /* Go to onboarding for UX */
        const urlOnboarding = `chrome-extension://${chrome.runtime.id}/link.html`;
        chrome.tabs.create({ url: urlOnboarding, selected: true }); // creates new tab
    } else if (
        request &&
        request.closeWebPage === true &&
        request.isSuccess === false
    ) {
        alert('유저 인증 관련 오류');
        chrome.tabs.getSelected(function (tab) {
            chrome.tabs.remove(tab.id);
        });
    } else if (
        request &&
        request.sender == 'baekjoon' &&
        request.task == 'SolvedApiCall'
    ) {
        SolvedApiCall(request.problemId).then((res) => sendResponse(res));
    }
    return true;
}

chrome.runtime.onMessage.addListener(handleMessage);
