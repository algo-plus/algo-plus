import { getProblemId } from '@/baekjoon/utils/parsing';
import {
    saveProblemDetail,
    saveProblemMathJaxStyle,
} from '@/baekjoon/utils/storage';

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

    await saveProblemDetail(problemId, fetchCurrentHtml());
    await saveProblemMathJaxStyle(problemId, fetchCurrentHtml());
};

export default customProblemPage;
