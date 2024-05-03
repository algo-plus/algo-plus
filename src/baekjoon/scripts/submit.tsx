import 'prism-code-editor/prism/languages/javascript';
import 'prism-code-editor/prism/languages/java';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
    getProblemId,
    parsingProblemDetail,
    parsingTestCases,
} from '@/baekjoon/utils/parsing';
import SolveView from '@/baekjoon/containers/SolveView/SolveView';
import { CodeOpen } from '../types/submit';
import {
    loadAndParseProblemDetail,
    loadAndParseProblemMathJaxStyle,
} from '../utils/storage/problem';
import { fetchProblemHtml } from '../apis/problem';

const customSubmitPage = () => {
    const addSplitView = async () => {
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

        let codeOpen: CodeOpen = 'close';
        const codeOpenRadios = document.querySelectorAll(
            'input[name=code_open]'
        );
        for (const codeOpenRadio of codeOpenRadios) {
            const inputElement = codeOpenRadio as HTMLInputElement;
            if (inputElement.hasAttribute('checked')) {
                codeOpen = inputElement.value as CodeOpen;
            }
        }

        if (problemId) {
            const solveView = await loadProblemData(
                problemId,
                csrfKey,
                codeOpen
            );
            createRoot(root).render(solveView);
        }

        if (contentContainer) {
            contentContainer.innerHTML = '';
            contentContainer.style.width = '100%';
            contentContainer.appendChild(problemMenu);
            contentContainer.appendChild(root);
        }
    };

    const loadProblemData = async (
        problemId: string,
        csrfKey: string,
        codeOpen: CodeOpen
    ) => {
        const loadedProblemContent = await loadAndParseProblemDetail(problemId);
        const loadedProblemStyle = await loadAndParseProblemMathJaxStyle(
            problemId
        );

        if (loadedProblemContent && loadedProblemStyle) {
            const parsedTestCases = parsingTestCases(
                loadedProblemContent.props.dangerouslySetInnerHTML.__html
            );
            return (
                <SolveView
                    problemId={problemId}
                    problemContent={loadedProblemContent}
                    problemStyle={loadedProblemStyle}
                    testCases={parsedTestCases}
                    csrfKey={csrfKey}
                    codeOpenDefaultValue={codeOpen}
                />
            );
        } else {
            fetchProblemHtml(
                problemId,
                async (html) => {
                    const parsedContent = parsingProblemDetail(html);
                    const parsedTestCases = parsingTestCases(html);
                    return (
                        <SolveView
                            problemId={problemId}
                            problemContent={parsedContent}
                            testCases={parsedTestCases}
                            csrfKey={csrfKey}
                            codeOpenDefaultValue={codeOpen}
                        />
                    );
                },
                (error) => {
                    console.error('문제를 불러오는데 실패했습니다.', error);
                    return (
                        <SolveView
                            problemId={problemId}
                            problemContent={
                                <h1>문제를 불러오는데 실패했습니다.</h1>
                            }
                            csrfKey={csrfKey}
                            codeOpenDefaultValue={codeOpen}
                        />
                    );
                }
            );
        }
    };

    const checkActiveState = async () => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('solve') === 'true') {
            // 기존 에디터 숨기기
            (
                document.querySelector(
                    '#submit_form > div:nth-child(5) > div.col-md-10'
                ) as HTMLDivElement
            ).style.display = 'none';

            // 기존 제출버튼 숨기기
            (
                document.querySelector(
                    '#submit_form > div:nth-child(7) > div'
                ) as HTMLDivElement
            ).style.display = 'none';

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
