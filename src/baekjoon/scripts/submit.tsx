import 'prism-code-editor/prism/languages/javascript';
import 'prism-code-editor/prism/languages/java';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { getProblemId } from '@/baekjoon/utils/parsing';
import SolveView from '@/baekjoon/containers/SolveView/SolveView';

const customSubmitPage = () => {
    const addSplitView = () => {
        const root = document.createElement('div');
        const problemId = getProblemId();

        document.title = `${problemId}번 문제 풀기`;

        const problemMenu = document.querySelector(
            'ul.problem-menu'
        ) as HTMLElement;
        problemMenu.style.marginBottom = '0';

        const contentContainer = document.querySelector(
            '.container.content'
        ) as HTMLElement;

        const csrfKey = (
            document.querySelector(
                '#submit_form > input[type=hidden]:nth-child(6)'
            ) as HTMLInputElement
        ).value;

        const solveView = <SolveView problemId={problemId} csrfKey={csrfKey} />;

        createRoot(root).render(solveView);

        if (contentContainer) {
            contentContainer.innerHTML = '';
            contentContainer.style.width = '100%';
            contentContainer.appendChild(problemMenu);
            contentContainer.appendChild(root);
        }
    };

    const checkActiveState = async () => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('solve') === 'true') {
            document
                .querySelectorAll('ul.problem-menu li.active')
                .forEach((activeItem) => {
                    activeItem.classList.remove('active');
                });

            const submitButton = document.querySelector(
                'ul.problem-menu li a[href*="/submit"]'
            );

            if (submitButton) {
                const solveButton = submitButton.closest('li')?.nextSibling;
                console.log('solveButton=', solveButton);
                if (solveButton && solveButton instanceof HTMLLIElement) {
                    solveButton.classList.add('active');
                }
                addSplitView();
            }
        }
    };

    window.addEventListener('load', checkActiveState);
};

export default customSubmitPage;
