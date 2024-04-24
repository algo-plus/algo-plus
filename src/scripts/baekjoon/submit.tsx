import 'prism-code-editor/prism/languages/javascript';
import 'prism-code-editor/prism/languages/java';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { EditorPanel } from './solve/components/EditorPanel';
import { SplitView } from './solve/components/SplitView';
import { getProblemId } from './utils';

const customSubmitPage = () => {
    const addSplitView = () => {
        const root = document.createElement('div');
        const problemId = getProblemId();

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

        const splitView = (
            <SplitView
                left={{ type: 'Problem', data: problemId }}
                right={{ type: 'Editor', data: csrfKey }}
            />
        );

        createRoot(root).render(splitView);

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
