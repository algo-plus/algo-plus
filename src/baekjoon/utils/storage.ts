import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';
import { parsingProblemDetail, parsingStyle } from './parsing';

interface ProblemDetail {
    htmlContent: string;
}

const saveProblemMathJaxStyle = async (
    problemId: string,
    htmlContent: string
): Promise<void> => {
    const mathJaxStyle = htmlContent.match(
        /<style id="MJX-CHTML-styles">[^]*?<\/style>/
    );
    await saveObjectInLocalStorage({ [problemId + `-style`]: mathJaxStyle });
};

const saveProblemDetail = async (
    problemId: string,
    htmlContent: string
): Promise<void> => {
    const problemDetail: ProblemDetail = { htmlContent };
    await saveObjectInLocalStorage({ [problemId]: problemDetail });
};

const loadAndParseProblemDetail = async (
    problemId: string
): Promise<JSX.Element | null> => {
    const result = (await getObjectFromLocalStorage(
        problemId
    )) as ProblemDetail;
    return result ? parsingProblemDetail(result.htmlContent) : null;
};

const loadAndParseProblemMathJaxStyle = async (
    problemId: string
): Promise<JSX.Element | null> => {
    const result = (await getObjectFromLocalStorage(
        problemId + `-style`
    )) as string;
    return result ? parsingStyle(result) : null;
};

export {
    saveProblemDetail,
    loadAndParseProblemDetail,
    saveProblemMathJaxStyle,
    loadAndParseProblemMathJaxStyle,
};
