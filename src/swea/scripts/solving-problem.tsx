import './solving-problem.css';

const customSolvingProblemPage = async (): Promise<void> => {
    console.log('editor custom');

    const problemRight: HTMLDivElement | null =
        document.querySelector('#problem_right');

    if (!problemRight) return;

    const algoplusWrapper: HTMLDivElement = document.createElement('div');
    algoplusWrapper.id = 'algoplus-wrapper';
    problemRight.appendChild(algoplusWrapper);

    const problemDescriptionContainer: HTMLDivElement =
        document.createElement('div');
    problemDescriptionContainer.id = 'problem-description-container';
    algoplusWrapper.appendChild(problemDescriptionContainer);

    const solveEditorContainer: HTMLDivElement = document.createElement('div');
    solveEditorContainer.id = 'solve-editor-container';
    algoplusWrapper.appendChild(solveEditorContainer);

    const accordion: HTMLDivElement = problemRight.querySelector(
        '.panel-group#accordion'
    ) as HTMLDivElement;
    problemDescriptionContainer.appendChild(accordion!);

    const editorPanel: HTMLDivElement = problemRight.querySelector(
        '.panel.panel-default:nth-child(2)'
    ) as HTMLDivElement;
    const btnCenter: HTMLDivElement = problemRight.querySelector(
        '.btn_center'
    ) as HTMLDivElement;
    const testWrap: HTMLDivElement = problemRight.querySelector('.test_wrap')
        ?.parentNode as HTMLDivElement;

    solveEditorContainer.appendChild(editorPanel!);
    solveEditorContainer.appendChild(testWrap!);
    solveEditorContainer.appendChild(btnCenter!);
};

export default customSolvingProblemPage;
