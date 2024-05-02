import { getProblemId } from '@/baekjoon/utils/parsing';
import {
    saveProblemDetail,
    loadAndParseProblemDetail,
    saveProblemMathJaxStyle,
    loadAndParseProblemMathJaxStyle,
} from '@/baekjoon/utils/storage/problem';

const fetchCurrentHtml = (): string => {
    return document.documentElement.innerHTML;
};

const customProblemPage = async (): Promise<void> => {
    const problemId = getProblemId();
    console.log('custom problem page...', problemId);

    if (!problemId) {
        console.error('문제 번호를 찾을 수 없습니다.');
        return;
    }

    const problemDetail = await loadAndParseProblemDetail(problemId);
    const problemMathJaxStyle = await loadAndParseProblemMathJaxStyle(
        problemId
    );

    if (!problemDetail) {
        console.log('No detail found in storage, saving new detail...');
        await saveProblemDetail(problemId, fetchCurrentHtml());
    }

    if (!problemMathJaxStyle) {
        await saveProblemMathJaxStyle(problemId, fetchCurrentHtml());
    }
};

export default customProblemPage;
