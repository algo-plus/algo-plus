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

    const headerCell = document.createElement('th');
    headerCell.textContent = '오답';
    headerCell.style.width = '5%';

    column[0].insertBefore(headerCell, column[0].firstChild);
    const rows = tableBody.querySelectorAll('tr');

    // 오답 체크박스
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const checkboxCell = document.createElement('td');
        checkboxCell.style.alignContent = 'center';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('note-checkbox');
        checkboxCell.appendChild(checkbox);
        row.insertBefore(checkboxCell, row.firstChild);
    }

    let modalStack: Array<{
        root: ReturnType<typeof createRoot>;
        container: HTMLElement;
        checkbox: HTMLInputElement;
    }> = [];

    const checkboxes = document.querySelectorAll('.note-checkbox');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            let checkedCount = 0;
            checkboxes.forEach((cb) => {
                let checked = cb as HTMLInputElement;
                if (checked.checked) {
                    checkedCount++;
                }
            });
            if (checkedCount + checkedCodeCount > 2) {
                (checkbox as HTMLInputElement).checked = false;
            }
            const isChecked = (checkbox as HTMLInputElement).checked;
            const row = checkbox.closest('tr');
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

                if (isChecked) {
                    saveReviewCode(
                        problemId as number,
                        submissionNumber as number,
                        memory as number,
                        time as number,
                        result,
                        checkbox as HTMLInputElement
                    );
                    openModal(
                        problemId as number,
                        submissionNumber as number,
                        memory as number,
                        time as number,
                        result,
                        checkbox as HTMLInputElement
                    );
                } else {
                    closeModal(checkbox as HTMLInputElement);
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
            reviewCode.result,
            reviewCode.checkbox
        );
        const checkcheckbox = reviewCode.checkbox;
        console.log('.................checkbox: ', checkcheckbox.value);
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
        result: string,
        checkbox: HTMLInputElement
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
                    onClose={() => closeModal(checkbox as HTMLInputElement)}
                />
            </React.StrictMode>
        );
        modalStack.push({
            root: modalRoot,
            container: modalContent,
            checkbox: checkbox,
        });
    }

    function closeModal(checkbox: HTMLInputElement) {
        // 모달 스택에서 연결된 체크박스를 가진 모달을 찾아 제거
        const modalIndex = modalStack.findIndex((m) => m.checkbox === checkbox);
        if (modalIndex !== -1) {
            const modal = modalStack[modalIndex];
            modal.root.unmount();
            modalContainer.removeChild(modal.container);
            modalStack.splice(modalIndex, 1);
            removeReviewCode();
        }
        checkbox.checked = false; // 체크박스 상태 업데이트
    }
};

export default customStatusPage;
