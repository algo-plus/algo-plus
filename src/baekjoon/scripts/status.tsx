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
import { CodeInfoModal } from '../components/CodeInfoModal';
import {
    clearReviewCode,
    loadReviewCode,
    removeReviewCode,
    saveReviewCode,
} from '../utils/storage/review';
import './status.css'

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
    const modalContainer = document.createElement('div');
    modalContainer.className = 'code-modal-backdrop';
    document.body.appendChild(modalContainer);

    const column = tableHead.querySelectorAll('tr');
    const columnHead = column[0].querySelectorAll('th');
    columnHead[3].style.width = '16%';

    const submissionIds = document.querySelectorAll(
        'table#status-table tbody tr td:first-child'
    );

    submissionIds.forEach((submissionId) => {
        submissionId.addEventListener('click', function () {
            const row = submissionId.closest('tr');
            if (row) {
                if (row.style.backgroundColor === 'lightgreen') {
                    row.style.backgroundColor = '';
                } else {
                    row.style.backgroundColor = 'lightgreen';
                }
            }
            console.log('Clicked submission ID:', submissionId.textContent);
            console.log(
                '...............................submissionIdClicked : ',
                row
            );
            console.log(
                '...............................color: ',
                row?.style.backgroundColor
            );
            if (row) {
                const problemId =
                    row.querySelector('.problem_title')?.textContent?.trim() ||
                    0;
                const submissionNumber =
                    row.querySelector('td:nth-child(2)')?.textContent?.trim() ||
                    0;
                const memory =
                    row.querySelector('.memory')?.textContent?.trim() || 0;
                const time =
                    row.querySelector('.time')?.textContent?.trim() || 0;
                const result =
                    row.querySelector('.result')?.textContent?.trim() || '';

                if (row.style.backgroundColor === 'lightgreen') {
                    saveReviewCode(
                        problemId as number,
                        submissionNumber as number,
                        memory as number,
                        time as number,
                        result
                    );
                } else {
                    closeModal();
                    removeReviewCode();
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
        for (const id of sourceCodeIds) {
            const sourceCode = await fetchCode(id);
            sourceCodes.push(sourceCode);
        }
        return sourceCodes;
    };

    const getCheckedSubmissionNumbers = () => {
        const checkedSubmissionNumbers: number[] = [];
        const checkboxes = document.querySelectorAll('.note-checkbox:checked');
        checkboxes.forEach((checkbox) => {
            const row = checkbox.closest('tr');
            if (row) {
                const submissionNumber: number = row.querySelector(
                    'td:nth-child(2)'
                )?.textContent as unknown as number;
                checkedSubmissionNumbers.push(submissionNumber);
            }
        });
        return checkedSubmissionNumbers.sort((a, b) => a - b);
    };

    // 오답노트 작성 버튼
    const button = document.createElement('button');
    button.textContent = '오답 노트 작성';
    button.classList.add('btn', 'btn-primary');
    button.addEventListener('click', async () => {
        console.log('Clicked note btn');
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-backdrop';
        document.body.appendChild(modalDiv);
        const root = createRoot(modalDiv);
        const sourceCodes = await getSourceCode();
        root.render(
            <React.StrictMode>
                <ReviewModal sourceCodes={sourceCodes} />
            </React.StrictMode>
        );
    });
    const anchor = document.querySelectorAll('.text-center');
    const position = anchor.length - 1;
    if (anchor) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.appendChild(button);
        anchor[position].insertBefore(container, anchor[position].firstChild); //
    }

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
        modalContainer.appendChild(modalContent);
        const modalRoot = createRoot(modalContent);
        modalRoot.render(
            <React.StrictMode>
                <CodeInfoModal
                    problemId={problemId}
                    submissionNumber={submissionNumber}
                    memory={memory}
                    time={time}
                    result={result}
                    onClose={() => closeModal()}
                />
            </React.StrictMode>
        );
    }

    function closeModal() {
        removeReviewCode();
    }
};

export default customStatusPage;
