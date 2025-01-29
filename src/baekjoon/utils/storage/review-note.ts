import { CodeStorageSaveInfo } from '@/baekjoon/types/review-note';
import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';

const REVIEW_CODE_STORAGE = 'algoplus-review-save';

const saveReviewCode = async (
    problemId: number,
    submissionNumber: number,
    memory: number,
    time: number,
    result: string
) => {
    const data: CodeStorageSaveInfo = {
        problemId: problemId,
        submissionNumber: submissionNumber,
        memory: memory,
        time: time,
        result: result,
    };
    let savedReviewCode = await loadReviewCode();
    if (savedReviewCode.length < 2) {
        savedReviewCode.push(data);
        await saveObjectInLocalStorage({
            [REVIEW_CODE_STORAGE]: savedReviewCode,
        });
    }
};

const loadReviewCode = async (): Promise<CodeStorageSaveInfo[]> => {
    const key = REVIEW_CODE_STORAGE;
    let result = (await getObjectFromLocalStorage(
        key
    )) as CodeStorageSaveInfo[];
    return result
        ? result.sort((a, b) => b.submissionNumber - a.submissionNumber)
        : [];
};

const removeReviewCode = async (
    submissionNumber: number
): Promise<CodeStorageSaveInfo[]> => {
    const key = REVIEW_CODE_STORAGE;
    let savedReviewCode = await loadReviewCode();
    if (savedReviewCode.length > 0) {
        savedReviewCode = savedReviewCode.filter(
            (code) => code.submissionNumber !== submissionNumber
        );
        await saveObjectInLocalStorage({
            [REVIEW_CODE_STORAGE]: savedReviewCode,
        });
    }
    const result = (await getObjectFromLocalStorage(
        key
    )) as CodeStorageSaveInfo[];
    return result;
};

const clearReviewCode = async () => {
    await saveObjectInLocalStorage({
        [REVIEW_CODE_STORAGE]: [],
    });
};

export { saveReviewCode, loadReviewCode, removeReviewCode, clearReviewCode };
