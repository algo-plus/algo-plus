import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';
import { parsingProblemDetail, parsingStyle } from '@/baekjoon/utils/parsing';
import { getDiffTime } from '@/baekjoon/utils/time';

const PROBLEM_STORAGE_KEY: string = 'algo-plus-problem-save';
const PROBLEM_STYLE_STORAGE_KEY: string = 'algo-plus-problem-style-save';
const EXPIRE_PERIOD: number = 86400000;

interface ProblemDetail {
    htmlContent: string;
}

const loadProblemStorage = (): Promise<Record<string, any>> => {
    return getObjectFromLocalStorage(PROBLEM_STORAGE_KEY);
};

const loadProblemStyleStorage = (): Promise<Record<string, any>> => {
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
    if (!problems) return null;
    const result = problems[problemId] as ProblemDetail;
    return result ? parsingProblemDetail(result.htmlContent) : null;
};

export const loadAndParseProblemMathJaxStyle = async (
    problemId: string
): Promise<JSX.Element | null> => {
    const problemStyles = await loadProblemStyleStorage();
    if (!problemStyles) return null;
    const result = problemStyles[problemId] as string;
    return result ? parsingStyle(result) : null;
};

const expireStorage = async (key: string, value: any) => {
    if (!value) return;
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
