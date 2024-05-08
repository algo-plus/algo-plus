import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';
import { parsingProblemDetail, parsingStyle } from '@/baekjoon/utils/parsing';
import { getDiffTime } from '../time';

const PROBLEM_STORAGE_KEY: string = 'algo-plus-problem-save4';
const PROBLEM_STYLE_STORAGE_KEY: string = 'algo-plus-problem-style-save4';
const EXPIRE_PERIOD: number = 30000;

interface ProblemDetail {
    htmlContent: string;
}

const loadProblemStorage = async (): Promise<Record<string, any>> => {
    console.log('loadProblemStorage');
    return getObjectFromLocalStorage(PROBLEM_STORAGE_KEY);
};

const loadProblemStyleStorage = async (): Promise<Record<string, any>> => {
    console.log('loadProblemStyleStorage');
    return getObjectFromLocalStorage(PROBLEM_STYLE_STORAGE_KEY);
};

export const saveProblemDetail = async (
    problemId: string,
    htmlContent: string
): Promise<void> => {
    const problemDetail: ProblemDetail = { htmlContent };
    await loadProblemStorage().then(async (value) => {
        await saveObjectInLocalStorage({
            [PROBLEM_STORAGE_KEY]: {
                ...value,
                [problemId]: problemDetail,
            },
        });
    });
};

export const saveProblemMathJaxStyle = async (
    problemId: string,
    htmlContent: string
): Promise<void> => {
    const mathJaxStyle = htmlContent.match(
        /<style id="MJX-CHTML-styles">[^]*?<\/style>/
    );
    await loadProblemStyleStorage().then(async (value) => {
        await saveObjectInLocalStorage({
            [PROBLEM_STYLE_STORAGE_KEY]: {
                ...value,
                [problemId]: mathJaxStyle,
            },
        });
    });
};

export const loadAndParseProblemDetail = async (
    problemId: string
): Promise<JSX.Element | null> => {
    const problems = await loadProblemStorage();
    const result = problems[problemId] as ProblemDetail;
    console.log('loadAndParseProblemDetail', problems);
    console.log('loadAndParseProblemDetail result', result);
    return result ? parsingProblemDetail(result.htmlContent) : null;
};

export const loadAndParseProblemMathJaxStyle = async (
    problemId: string
): Promise<JSX.Element | null> => {
    const problemStyles = await loadProblemStyleStorage();
    const result = problemStyles[problemId] as string;
    console.log('loadAndParseProblemMathJaxStyle', problemStyles);
    console.log('loadAndParseProblemMathJaxStyle result', result);
    return result ? parsingStyle(result) : null;
};

const expireStorage = async (key: string, value: any) => {
    const now: Date = new Date();
    const lastExpiredDate: Date =
        value['lastExpiredDate'] != undefined
            ? new Date(value['lastExpiredDate'])
            : new Date(0);
    if (
        !lastExpiredDate ||
        getDiffTime(now, lastExpiredDate) >= EXPIRE_PERIOD
    ) {
        await saveObjectInLocalStorage({
            [key]: {
                ['lastExpiredDate']: new Date().toString(),
            },
        });
    }
};

export const clearProblemStorage = async () => {
    loadProblemStorage().then((value: any) => {
        expireStorage(PROBLEM_STORAGE_KEY, value);
    });
    loadProblemStyleStorage().then((value: any) => {
        expireStorage(PROBLEM_STYLE_STORAGE_KEY, value);
    });
};
