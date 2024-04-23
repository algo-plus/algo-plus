import React from 'react';
import { SplitView } from './solve/components/SplitView';
import { SubmitPostRequest } from './types/submit';
import { submit } from './apis/submit';
import { getProblemId } from './utils';
import { createRoot } from 'react-dom/client';

export default function customSubmitPage(): void {
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

        const splitView = (
            <SplitView
                left={{ type: 'Problem', data: problemId }}
                right={{ type: 'Editor' }}
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

    console.log('custom submit page...');

    const submitHandle = (event: Event) => {
        event.preventDefault();
        const csrfKey = (
            document.querySelector(
                '#submit_form > input[name=csrf_key]'
            ) as HTMLInputElement
        ).value;

        // TODO: 더미 데이터 제거 후 에디터 연결
        const data: SubmitPostRequest = {
            problem_id: 1000,
            language: 0,
            code_open: 'onlyaccepted',
            source: '#include <stdio.h>\n\nint main()\n{\n    int a,b;\n    scanf("%d",&a);\n    scanf("%d",&b);\n    printf("%d",a+b);\n    return 0;\n}',
            csrf_key: csrfKey,
        };

        submit(
            data,
            (response) => {
                const responseURL = response.request.responseURL;
                if (responseURL) {
                    console.log('code submit... responseURL=' + responseURL);
                    // TODO: 코드 제출 후 로직 작성
                }
            },
            console.error
        );
    };

    const mySubmitButton = document.createElement('button');
    mySubmitButton.innerText = '제출 테스트';
    mySubmitButton.addEventListener('click', submitHandle);

    const buttonContainer = document.querySelector(
        '#submit_form > div:nth-child(7) > div'
    ) as HTMLDivElement;
    buttonContainer.appendChild(mySubmitButton);

    window.addEventListener('load', checkActiveState);
}
