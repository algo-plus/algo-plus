import { createRoot } from 'react-dom/client';
import React from 'react';
import { getUrlSearchParam } from '@/common/utils/url';
import {
    getWrongModalMessage,
    isJudgingState,
    isWrongState,
} from '@/baekjoon/utils/status';
import WrongResultModal from '@/baekjoon/containers/WrongResultModal/WrongResultModal';
import './status.css';
import { ReviewNotePopUp } from '@/baekjoon/containers/ReviewNotePopUp';

const customStatusPage = async () => {
    const problemId = getUrlSearchParam(window.location.href, 'problem_id');
    if (!problemId) return;

    if (
        getUrlSearchParam(window.location.href, 'after_algoplus_submit') ===
        'true'
    ) {
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

    // custom status table
    const table = document.querySelector('#status-table') as HTMLTableElement;
    table.classList.remove('table-striped');
    table.classList.add('algoplus-status-table');

    const tableHead = table.querySelector('thead') as HTMLTableSectionElement;
    const tableResultHeader = tableHead.querySelector(
        'tr > th:nth-child(4)'
    ) as HTMLElement;
    tableResultHeader.style.width = '16%';

    // 오답노트 코드 선택창
    const divElement = document.createElement('div');
    document.body.appendChild(divElement);
    const root = createRoot(divElement);
    root.render(<ReviewNotePopUp problemId={problemId} />);
};

export default customStatusPage;
