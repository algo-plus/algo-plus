import {
    postprecessOutput,
    processErrorCode,
    trimLineByLine,
} from './baekjoon/utils/compile';
import { CodeCompileRequest } from './common/types/compile';

/**
 * solvedac 문제 데이터를 파싱해오는 함수.
 */
async function SolvedApiCall(problemId: number) {
    return fetch(
        `https://solved.ac/api/v3/problem/show?problemId=${problemId}`,
        { method: 'GET' }
    ).then((query) => query.json());
}

/**
 *
 * 컴파일 api를 호출하는 함수
 */
async function compile(data: CodeCompileRequest) {
    return fetch(process.env.JDOODLE_API_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) throw new Error(response.status.toString());
            return response.json();
        })
        .then((json) => trimLineByLine(json.output))
        .then((output) => postprecessOutput(data.language, output))
        .catch((e) => processErrorCode(e.message));
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
    } else if (request && request.action == 'compile') {
        try {
            compile(request.data).then((res) => sendResponse(res));
        } catch (e) {
            console.error(e);
            sendResponse('error');
        }
    }
    return true;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveRepository') {
        const blob = new Blob([request.content], { type: 'text/markdown' });
        let today = new Date();

        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result;

            if (typeof dataUrl === 'string') {
                chrome.downloads.download(
                    {
                        url: dataUrl,
                        filename: `AlgoPlus${today.getFullYear()}${(
                            today.getMonth() + 1
                        )
                            .toString()
                            .padStart(2, '0')}${today
                            .getDate()
                            .toString()
                            .padStart(2, '0')}.md`,
                        saveAs: true,
                    },
                    (downloadId) => {
                        if (downloadId) {
                            sendResponse({ status: 'success' });
                        } else {
                            sendResponse({
                                status: 'error',
                                message: 'Download failed',
                            });
                        }
                    }
                );
            } else {
                sendResponse({
                    status: 'error',
                    message: 'Failed to create data URL',
                });
            }
        };
        reader.readAsDataURL(blob);
        return true;
    }
});

chrome.runtime.onMessage.addListener(handleMessage);
