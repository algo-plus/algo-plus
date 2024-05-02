const judgingClassNames = ['result-wait', 'result-compile', 'result-judging'];
const acceptClassNames = ['result-ac', 'result-pac'];
const wrongClassNames = [
    'result-wa',
    'result-ce',
    'result-rte',
    'result-tle',
    'result-mle',
    'result-ole',
    'result-pe',
    'result-del',
];

function isWrongState(): boolean {
    const tag = getFirstStatusResultTag();
    if (!tag) return false;
    return wrongClassNames.includes(tag);
}

function isJudgingState(): boolean {
    const tag = getFirstStatusResultTag();
    if (!tag) return false;
    return judgingClassNames.includes(tag);
}

function getFirstStatusResultTag(): string | undefined {
    return document.querySelector(
        '#status-table > tbody > tr:first-child .result-text'
    )?.classList[1];
}

function getWrongModalMessage(): string | null {
    const element = document.querySelector(
        '#status-table > tbody > tr:first-child .result-text'
    );
    if (!element) return null;
    if (element.classList[1] === 'result-wa') return '결과를 확인해 주세요.';
    return element.textContent;
}

export { isWrongState, isJudgingState, getWrongModalMessage };
