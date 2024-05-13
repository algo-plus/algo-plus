import { createRoot } from 'react-dom/client';
import { ReviewModal } from '@/baekjoon/containers/ReviewModal';
import React from 'react';
import { fetchCode } from '../apis/source';
import { getUrlSearchParam } from '@/common/utils/url';
import {
    getWrongModalMessage,
    isJudgingState,
    isWrongState,
} from '@/baekjoon/utils/status';
import WrongResultModal from '../containers/WrongResultModal/WrongResultModal';
import { CodeInfoContent } from '../components/CodeInfoContent';
import {
    clearReviewCode,
    loadReviewCode,
    removeReviewCode,
    saveReviewCode,
} from '../utils/storage/review';
import './status.css';

const customStatusPage = async () => {
    if (
        getUrlSearchParam(window.location.href, 'after_algoplus_submit') ===
        'true'
    ) {
        let timer = setInterval(() => {
            if (isJudgingState()) {
            } else {
                clearInterval(timer);
                if (isWrongState()) {
                    const problemId = getUrlSearchParam(
                        window.location.href,
                        'problem_id'
                    );
                    const message = getWrongModalMessage();

                    if (!problemId) return;
                    const root = document.createElement('div');
                    document.body.appendChild(root);
                    createRoot(root).render(
                        <WrongResultModal
                            problemId={problemId}
                            message={message}
                        />
                    );
                }
            }
        }, 500);
    }
    const currentProblemId = getUrlSearchParam(
        window.location.href,
        'problem_id'
    );

    let reviewCodes = await loadReviewCode();
    let checkedCodeCount = reviewCodes.length;

    if (
        checkedCodeCount > 0 &&
        currentProblemId != (reviewCodes[0].problemId as unknown as string)
    ) {
        clearReviewCode();
    }

    const table = document.querySelector('#status-table');
    if (!table) return;
    const tableHead = table.querySelector('thead');
    if (!tableHead) return;
    const tableBody = table.querySelector('tbody');
    if (!tableBody) return;

    // 선택된 코드 리스트 모달
    const codeModalBackdrop = document.createElement('div');
    codeModalBackdrop.className = 'code-modal-backdrop';
    document.body.appendChild(codeModalBackdrop);

    const codeModalContainer = document.createElement('div');
    codeModalContainer.className = 'code-modal-container';
    codeModalBackdrop.appendChild(codeModalContainer);

    // 오답노트 작성 버튼
    const button = document.createElement('button');
    button.textContent = '오답 노트 작성';
    button.classList.add('btn', 'btn-primary');

    button.addEventListener('click', async () => {
        const sourceCodes = await getSourceCode();
        if (sourceCodes.length === 0) {
            alert('제출번호를 눌러 코드를 선택해주세요.(최대 2개)');
            return;
        }
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-backdrop';
        document.body.appendChild(modalDiv);
        const root = createRoot(modalDiv);
        root.render(
            <React.StrictMode>
                <ReviewModal sourceCodes={sourceCodes} />
            </React.StrictMode>
        );
    });

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.appendChild(button);
    codeModalContainer.appendChild(container);

    const column = tableHead.querySelectorAll('tr');
    const columnHead = column[0].querySelectorAll('th');
    columnHead[3].style.width = '16%';

    const submissionIds = document.querySelectorAll(
        'table#status-table tbody tr td:first-child'
    );

    submissionIds.forEach((submissionId) => {
        (submissionId as HTMLInputElement).style.cursor = 'pointer';
        submissionId.addEventListener('click', function () {
            const row = submissionId.closest('tr');
            if (row) {
                const submissionNumber =
                    row.querySelector('td:nth-child(1)')?.textContent?.trim() ||
                    0;
                if (
                    row.style.backgroundColor !== 'lightcyan' &&
                    checkedCodeCount < 2
                ) {
                    row.style.backgroundColor = 'lightcyan';
                    checkedCodeCount++;
                    const problemId =
                        row
                            .querySelector('.problem_title')
                            ?.textContent?.trim() || 0;
                    const memory =
                        row.querySelector('.memory')?.textContent?.trim() || 0;
                    const time =
                        row.querySelector('.time')?.textContent?.trim() || 0;
                    const result =
                        row.querySelector('.result')?.textContent?.trim() || '';
                    saveReviewCode(
                        problemId as number,
                        submissionNumber as number,
                        memory as number,
                        time as number,
                        result
                    );
                    openModal(
                        problemId as number,
                        submissionNumber as number,
                        memory as number,
                        time as number,
                        result
                    );
                } else if (row.style.backgroundColor === 'lightcyan') {
                    checkedCodeCount--;
                    row.style.backgroundColor = '';
                    closeModal(submissionNumber as number);
                    removeReviewCode();
                } else {
                    alert('코드는 최대 2개까지만 선택할 수 있습니다.');
                    return;
                }
            }
        });
    });

    reviewCodes.forEach((reviewCode) => {
        openModal(
            reviewCode.problemId,
            reviewCode.submissionNumber,
            reviewCode.memory,
            reviewCode.time,
            reviewCode.result
        );
    });

    const getSourceCode = async () => {
        const sourceCodeIds = getCheckedSubmissionNumbers();
        const sourceCodes = [];
        for (const id of await sourceCodeIds) {
            const sourceCode = await fetchCode(id);
            sourceCodes.push(sourceCode);
        }
        return sourceCodes;
    };

    const getCheckedSubmissionNumbers = async () => {
        const checkedSubmissionNumbers: number[] = [];
        const reviewCodes = await loadReviewCode();
        for (const reviewCode of reviewCodes) {
            checkedSubmissionNumbers.push(reviewCode.submissionNumber);
        }
        return checkedSubmissionNumbers.sort((a, b) => a - b);
    };

    // 코드 리스트 작성 모달 생성
    function openModal(
        problemId: number,
        submissionNumber: number,
        memory: number,
        time: number,
        result: string
    ) {
        const modalContent = document.createElement('div');
        modalContent.className = 'code-modal-content';
        codeModalContainer.appendChild(modalContent);
        modalContent.id = `modal-${submissionNumber}`;

        const modalRoot = createRoot(modalContent);
        modalRoot.render(
            <React.StrictMode>
                <CodeInfoContent
                    problemId={problemId}
                    submissionNumber={submissionNumber}
                    memory={memory}
                    time={time}
                    result={result}
                    onClose={() => closeModal(submissionNumber)}
                />
            </React.StrictMode>
        );
    }

    function closeModal(submissionNumber: number) {
        removeReviewCode();
        const modalToClose = document.querySelector(
            `#modal-${submissionNumber}`
        );
        if (modalToClose) {
            modalToClose.remove();
            checkedCodeCount--;
            const submissionId = document.querySelector(
                `#solution-${submissionNumber}`
            );
            if (submissionId) {
                const row = submissionId.closest('tr');
                if (row) {
                    row.style.backgroundColor = '';
                }
            }
        }
    }
};

export default customStatusPage;
