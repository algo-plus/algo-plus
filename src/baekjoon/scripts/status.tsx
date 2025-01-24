import { createRoot } from 'react-dom/client';
import { ReviewModal } from '@/baekjoon/containers/ReviewModal';
import React from 'react';
import { fetchCode } from '@/baekjoon/apis/source';
import { getUrlSearchParam } from '@/common/utils/url';
import {
    getWrongModalMessage,
    isJudgingState,
    isWrongState,
} from '@/baekjoon/utils/status';
import WrongResultModal from '@/baekjoon/containers/WrongResultModal/WrongResultModal';
import { CodeInfoContent } from '@/baekjoon/components/CodeInfoContent';
import {
    clearReviewCode,
    loadReviewCode,
    removeReviewCode,
    saveReviewCode,
} from '@/baekjoon/utils/storage/review';
import './status.css';
import { CodeNullContent } from '@/baekjoon/components/CodeINullContent';

const customStatusPage = async () => {
    if (
        getUrlSearchParam(window.location.href, 'after_algoplus_submit') ===
        'true'
    ) {
        const problemId = getUrlSearchParam(window.location.href, 'problem_id');
        if (!problemId) return;

        let timer = setInterval(() => {
            if (isJudgingState()) {
                return;
            }
            clearInterval(timer);
            if (isWrongState()) {
                const message = getWrongModalMessage();
                const root = document.createElement('div');
                document.body.appendChild(root);
                createRoot(root).render(
                    <WrongResultModal problemId={problemId} message={message} />
                );
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
        reviewCodes = await loadReviewCode();
        checkedCodeCount = reviewCodes.length;
    }

    // custom status table
    const table = document.querySelector('#status-table') as HTMLTableElement;
    table.classList.remove('table-striped');
    table.classList.add('algoplus-status-table');

    const tableHead = table.querySelector('thead') as HTMLTableSectionElement;
    const tableResultHeader = tableHead.querySelector(
        'tr > th:nth-child(4)'
    ) as HTMLElement;
    tableResultHeader.style.width = '16%';

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
    container.className = 'save-button-container';
    container.style.display = 'flex';
    container.appendChild(button);
    codeModalContainer.appendChild(container);

    // add submit code select event
    const submissionIds = document.querySelectorAll(
        'table#status-table tbody tr td:first-child'
    );

    submissionIds.forEach((submissionId) => {
        submissionId.addEventListener('click', async function () {
            const row = submissionId.closest('tr') as HTMLElement;
            const submissionNumber = (row
                .querySelector('td:nth-child(1)')
                ?.textContent?.trim() || 0) as number;
            if (row.classList.contains('algoplus-code-select')) {
                row.classList.remove('algoplus-code-select');
                closeModal(submissionNumber as number);
                removeReviewCode(submissionNumber as number);
                return;
            }
            if (checkedCodeCount >= 2) {
                alert('코드는 최대 2개까지만 선택할 수 있습니다.');
                return;
            }

            checkedCodeCount++;
            row.classList.add('algoplus-code-select');

            const problemId = (row
                .querySelector('.problem_title')
                ?.textContent?.trim() || 0) as number;
            const memory = (row.querySelector('.memory')?.textContent?.trim() ||
                0) as number;
            const time = (row.querySelector('.time')?.textContent?.trim() ||
                0) as number;
            const result =
                row.querySelector('.result')?.textContent?.trim() || '';

            saveReviewCode(problemId, submissionNumber, memory, time, result);
            openModal(problemId, submissionNumber, memory, time, result);
        });
    });

    if (reviewCodes.length > 0) {
        reviewCodes.forEach((reviewCode) => {
            openModal(
                reviewCode.problemId,
                reviewCode.submissionNumber,
                reviewCode.memory,
                reviewCode.time,
                reviewCode.result
            );
            const lineToColor = document.querySelector(
                `#solution-${reviewCode.submissionNumber}`
            );
            if (lineToColor) {
                const row = lineToColor.closest('tr');
                if (row) {
                    row.classList.add('algoplus-code-select');
                }
            }
        });
    } else {
        openNullModal();
    }

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
    async function openModal(
        problemId: number,
        submissionNumber: number,
        memory: number,
        time: number,
        result: string
    ) {
        const modalContentTemp = document.querySelector('.code-modal-content');
        const modalContent = document.createElement('div');
        modalContent.className = 'code-modal-content';
        modalContent.id = `modal-${submissionNumber}`;
        await loadReviewCode();
        if (
            (await loadReviewCode()).length == 2 &&
            modalContentTemp !== null &&
            (await loadReviewCode())[0].submissionNumber == submissionNumber
        ) {
            codeModalContainer.insertBefore(modalContent, modalContentTemp);
        } else {
            codeModalContainer.insertBefore(modalContent, container);
        }
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
        closeNullModal();
    }

    // 코드 리스트 안내 모달 생성
    async function openNullModal() {
        const modalContent = document.createElement('div');
        modalContent.className = 'code-modal-null';
        codeModalContainer.insertBefore(modalContent, container);
        const modalRoot = createRoot(modalContent);
        modalRoot.render(
            <React.StrictMode>
                <CodeNullContent />
            </React.StrictMode>
        );
    }

    function closeModal(submissionNumber: number) {
        removeReviewCode(submissionNumber);
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
                    row.classList.remove('algoplus-code-select');
                }
            }
        }
        if (checkedCodeCount == 0) {
            openNullModal();
        }
    }

    function closeNullModal() {
        const modalToClose = document.querySelector(`.code-modal-null`);
        if (modalToClose) {
            modalToClose.remove();
        }
    }
};

export default customStatusPage;
