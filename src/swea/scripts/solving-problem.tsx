import { createRoot } from 'react-dom/client';
import './solving-problem.css';
import SolveViewWrapper from '@/common/presentations/SolveViewWrapper/SolveViewWrapper';
import React, { useEffect } from 'react';

const customSolvingProblemPage = async (): Promise<void> => {
    const injectSolveViewPanels = () => {
        const problemRight = document.querySelector(
            '#problem_right'
        ) as HTMLDivElement;

        const problemDescriptionPanel = document.querySelector(
            '#problem-description-panel'
        ) as HTMLDivElement;

        const accordion: HTMLDivElement = problemRight.querySelector(
            '.panel-group#accordion'
        ) as HTMLDivElement;
        problemDescriptionPanel?.appendChild(accordion!);

        const editorPanel: HTMLDivElement = problemRight.querySelector(
            '.panel.panel-default:nth-child(2)'
        ) as HTMLDivElement;
        const btnCenter: HTMLDivElement = problemRight.querySelector(
            '.btn_center'
        ) as HTMLDivElement;
        const testWrap: HTMLDivElement = problemRight.querySelector(
            '.test_wrap'
        )?.parentNode as HTMLDivElement;

        const solveEditorPanel = document.querySelector(
            '#solve-editor-panel'
        ) as HTMLDivElement;
        solveEditorPanel?.appendChild(editorPanel!);

        const problemCodeTop: HTMLDivElement = problemRight.querySelector(
            '.problem_code_top'
        ) as HTMLDivElement;
        const solveEditorPanelTop = document.querySelector(
            '#solve-editor-panel-top'
        ) as HTMLDivElement;
        solveEditorPanelTop?.appendChild(problemCodeTop!);

        const testCasePanel = document.querySelector(
            '#test-case-panel'
        ) as HTMLDivElement;

        testCasePanel?.appendChild(testWrap!);
        testCasePanel?.appendChild(btnCenter!);
    };

    const customProblemDescriptionPanel = () => {
        const problemDescriptionPanel = document.querySelector(
            '#problem-description-panel'
        ) as HTMLDivElement;
    };

    const customSolveEditorPanel = () => {
        const solveEditorPanel = document.querySelector(
            '#solve-editor-panel'
        ) as HTMLDivElement;
        const solveEditorPanelTop = document.querySelector(
            '#solve-editor-panel-top'
        ) as HTMLDivElement;

        solveEditorPanel.querySelector('#headingTwo')!.remove();
        solveEditorPanel.querySelector('.test_top_area')?.remove();
        const codeResetButton = solveEditorPanel.querySelector(
            '#defaultCategoryButton > .btn'
        ) as HTMLAnchorElement;

        solveEditorPanelTop.querySelector('#kataCategoryButton')?.remove();

        const btnRight = document.createElement('div');
        btnRight.className = 'btn_right';
        btnRight.appendChild(codeResetButton);

        solveEditorPanelTop
            .querySelector('.problem_code_top')
            ?.appendChild(btnRight);
    };

    const customTestCasePanel = () => {
        const testCasePanel = document.querySelector(
            '#stest-case-panel'
        ) as HTMLDivElement;
    };

    const renderAlgoPlusSolveView = () => {
        const problemRight: HTMLDivElement | null =
            document.querySelector('#problem_right');

        if (!problemRight) return;

        problemRight.style.overflowX = 'none';

        const algoplusWrapper: HTMLDivElement = document.createElement('div');
        algoplusWrapper.id = 'algoplus-wrapper';
        algoplusWrapper.classList.add('swea');
        problemRight.appendChild(algoplusWrapper);

        const solvingProblemView = (
            <SolveViewWrapper
                problemDescriptionPanel={
                    <div id='problem-description-panel'></div>
                }
                solveEditorPanelTop={<div id='solve-editor-panel-top'></div>}
                solveEditorPanel={<div id='solve-editor-panel'></div>}
                testCasePanel={<div id='test-case-panel'></div>}
            />
        );
        createRoot(algoplusWrapper).render(solvingProblemView);
    };

    renderAlgoPlusSolveView();
    setTimeout(injectSolveViewPanels, 0);
    setTimeout(customProblemDescriptionPanel, 0);
    setTimeout(customSolveEditorPanel, 0);
    setTimeout(customTestCasePanel, 0);
};

export default customSolvingProblemPage;
