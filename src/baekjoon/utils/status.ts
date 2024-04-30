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

export { isWrongState, isJudgingState, getFirstStatusResultTag };
