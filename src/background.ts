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
            const tabid: number | undefined = tab.id;
            if (typeof tabid !== 'undefined') {
                chrome.tabs.remove(tabid);
            }
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveRepository') {
        const blob = new Blob([request.content], { type: 'text/markdown' });
        let today = new Date();

        // Convert Blob to Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result; // This will be the data URL
            // Check if dataUrl is a string before proceeding
            if (typeof dataUrl === 'string') {
                chrome.downloads.download({
                    url: dataUrl,
                    filename: `AlgoPlus${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.md`,
                    saveAs: true, // Show the save dialog to the user
                    }, (downloadId) => {
                        if (downloadId) {
                            console.log('Download initiated with ID:', downloadId);
                            sendResponse({ status: 'success' });
                        } else {
                            sendResponse({ status: 'error', message: 'Download failed' });
                        }
                    });
                } else {
                    sendResponse({ status: 'error', message: 'Failed to create data URL' });
                }
            };
        reader.readAsDataURL(blob); // Convert the blob to a data URL
    return true; // To indicate that we will send a response asynchronously
    }
});


chrome.runtime.onMessage.addListener(handleMessage);
