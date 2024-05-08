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
        chrome.storage.local.set({ AlgoPlus_username: request.username });
        chrome.storage.local.set({ AlgoPlus_token: request.token });
        chrome.storage.local.set({ pipe_AlgoPlus: false }, () => {
            console.log('Closed pipe.');
        });

        const urlOnboarding = `chrome-extension://${chrome.runtime.id}/link.html`;
        chrome.tabs.create({ url: urlOnboarding, selected: true });
    } else if (
        request &&
        request.closeWebPage === true &&
        request.isSuccess === false
    ) {
        alert('유저 인증 관련 오류');
        chrome.tabs.getSelected((tab) => {
            chrome.tabs.remove(tab.id);
        });
    } else if (
        request &&
        request.sender == 'baekjoon' &&
        request.task == 'SolvedApiCall'
    ) {
        SolvedApiCall(request.problemId).then((res) => sendResponse(res));
    } else if (
        request &&
        request.action == 'saveRepository' &&
        request.repositoryName
    ) {
        chrome.storage.local.set({ repositories: request.repositoryName });
        chrome.storage.local.get((result) => console.log(result));
    }
    return true;
}

chrome.runtime.onMessage.addListener(handleMessage);
