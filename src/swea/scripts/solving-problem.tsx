import { createRoot } from 'react-dom/client';
import './solving-problem.css';
import SolveViewWrapper from '@/common/containers/SolveViewWrapper/SolveViewWrapper';
import React from 'react';
import { ReviewNotePopUp } from '@/swea/containers/ReviewNotePopUp';

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

        const solveViewFooter = document.querySelector(
            '#solve-view-footer'
        ) as HTMLDivElement;
        const btnCenter: HTMLDivElement = problemRight.querySelector(
            '.btn_center'
        ) as HTMLDivElement;
        solveViewFooter?.appendChild(btnCenter!);
    };

    const customProblemDescriptionPanel = () => {
        const problemDescriptionPanel = document.querySelector(
            '#problem-description-panel'
        ) as HTMLDivElement;

        problemDescriptionPanel.querySelectorAll('img').forEach((img) => {
            if (img.style.width) {
                img.style.maxWidth = img.style.width;
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });
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
            '#test-case-panel'
        ) as HTMLDivElement;

        testCasePanel.querySelector('p.ico_infotxt')?.remove();

        const inputTitle = testCasePanel.querySelector(
            '.test_wrap .test_in .left .tit'
        ) as HTMLSpanElement;

        const infoDetail: HTMLDivElement = document.createElement('div');
        infoDetail.id = 'testcase-input-detail';

        const infoIcon: HTMLImageElement = document.createElement('img');
        infoIcon.src = '../images/sw_sub/sw_icon/icon_info.png';
        infoIcon.width = 20;
        infoIcon.classList.add('info-icon');

        const infoText: HTMLSpanElement = document.createElement('span');
        infoText.innerText =
            'Input을 입력하고 Run을 선택하면 Output 결과를 확인할 수 있습니다. Input 값을 넣지 않으면 기본 Input값이 적용되어 실행됩니다. Test는 채점을 하는 것이 아니며 정답 여부를 알려주지 않습니다.';
        infoText.classList.add('info-text');

        infoDetail.appendChild(infoIcon);
        infoDetail.appendChild(infoText);

        inputTitle.appendChild(infoDetail);
    };

    const customFooter = () => {
        const solveViewFooter = document.querySelector(
            '#solve-view-footer'
        ) as HTMLDivElement;

        const buttonContainer = document.querySelector(
            '.btn_center'
        ) as HTMLDivElement;

        buttonContainer.classList.remove('btn_center');
        buttonContainer.classList.add('algoplus-button-container');

        buttonContainer.querySelectorAll('a').forEach((btn) => {
            btn.classList.remove('lg');
            btn.classList.add('sm');
        });
    };

    const customLeftPanel = () => {
        const problemLeft = document.querySelector(
            '.problem_left#problem_left'
        ) as HTMLDivElement;

        problemLeft.style.width = '480px';

        const moreLeftLeft = problemLeft.querySelector(
            '#more-less-left'
        ) as HTMLAnchorElement;
        moreLeftLeft.click();
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
                footer={<div id='solve-view-footer'></div>}
            />
        );
        createRoot(algoplusWrapper).render(solvingProblemView);
    };

    const renderAlgoPlusReviewNotePopUp = () => {
        const problemWrap: HTMLDivElement | null = document.querySelector(
            'form[name="contestForm"] .problem_wrap'
        );

        if (!problemWrap) return;

        const algoplusPopUpWrapper: HTMLDivElement =
            document.createElement('div');
        algoplusPopUpWrapper.id = 'algoplus-modal-wrapper';
        problemWrap.appendChild(algoplusPopUpWrapper);

        const reviewNotePopUp = <ReviewNotePopUp />;
        createRoot(algoplusPopUpWrapper).render(reviewNotePopUp);
    };

    renderAlgoPlusSolveView();
    renderAlgoPlusReviewNotePopUp();
    setTimeout(injectSolveViewPanels, 0);
    setTimeout(customLeftPanel, 0);
    setTimeout(customProblemDescriptionPanel, 0);
    setTimeout(customSolveEditorPanel, 0);
    setTimeout(customTestCasePanel, 0);
    setTimeout(customFooter, 0);
};

export default customSolvingProblemPage;
