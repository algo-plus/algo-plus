import React, { createElement } from 'react';
import { getUrlSearchParam } from '@/common/utils/url';
import {
    getWrongModalMessage,
    isJudgingState,
    isWrongState,
} from '@/baekjoon/utils/status';
import WrongResultModal from '../containers/WrongResultModal/WrongResultModal';
import { createRoot } from 'react-dom/client';

const customStatusPageTemp = () => {
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
};

export default customStatusPageTemp;
