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
    result: string,
    checkbox: HTMLInputElement
) => {
    const data: CodeInfoModalProps = {
        problemId: problemId,
        submissionNumber: submissionNumber,
        memory: memory,
        time: time,
        result: result,
        checkbox: checkbox
    };
    let savedReviewCode = await loadReviewCode();
    if (savedReviewCode.length < 2) {
        savedReviewCode.push(data);
        await saveObjectInLocalStorage({
            [REVIEW_CODE_STORAGE]: savedReviewCode,
        });
    }

};

const loadReviewCode = async (): Promise<CodeInfoModalProps[]> => {
    const key = REVIEW_CODE_STORAGE;
    const result = (await getObjectFromLocalStorage(
        key
    )) as CodeInfoModalProps[];
    return result ? result : [];
};

const removeReviewCode = async (): Promise<CodeInfoModalProps[]> => {
    const key = REVIEW_CODE_STORAGE;
    let savedReviewCode = await loadReviewCode();
    if (savedReviewCode.length > 0) {
        savedReviewCode.pop();
        await saveObjectInLocalStorage({
            [REVIEW_CODE_STORAGE]: savedReviewCode,
        });
    }
    const result = (await getObjectFromLocalStorage(
        key
    )) as CodeInfoModalProps[];
    return result;
};

const clearReviewCode = async () => {
    await saveObjectInLocalStorage({
        [REVIEW_CODE_STORAGE]: [],
    });
    const result = (await getObjectFromLocalStorage(
        REVIEW_CODE_STORAGE
    )) as CodeInfoModalProps[];
    return result;
};

export { saveReviewCode, loadReviewCode, removeReviewCode, clearReviewCode };
