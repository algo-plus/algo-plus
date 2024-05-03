import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';
import { parsingProblemDetail, parsingStyle } from '@/baekjoon/utils/parsing';

interface ProblemDetail {
    htmlContent: string;
}

export const saveProblemMathJaxStyle = async (
    problemId: string,
    htmlContent: string
): Promise<void> => {
    const mathJaxStyle = htmlContent.match(
        /<style id="MJX-CHTML-styles">[^]*?<\/style>/
    );
    await saveObjectInLocalStorage({ [problemId + `-style`]: mathJaxStyle });
};

export const saveProblemDetail = async (
    problemId: string,
    htmlContent: string
): Promise<void> => {
    const problemDetail: ProblemDetail = { htmlContent };
    await saveObjectInLocalStorage({ [problemId]: problemDetail });
};

export const loadAndParseProblemDetail = async (
    problemId: string
): Promise<JSX.Element | null> => {
    const result = (await getObjectFromLocalStorage(
        problemId
    )) as ProblemDetail;
    return result ? parsingProblemDetail(result.htmlContent) : null;
};

export const loadAndParseProblemMathJaxStyle = async (
    problemId: string
): Promise<JSX.Element | null> => {
    const result = (await getObjectFromLocalStorage(
        problemId + `-style`
    )) as string;
    return result ? parsingStyle(result) : null;
};
