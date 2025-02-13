import { CodeInfo } from '@/baekjoon/types/review-note';
import {
    getObjectFromLocalStorage,
    removeObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';

const REVIEW_NOTE_PROBLEM_ID = 'algoplus-review-note-problem-id';
const REVIEW_NOTE_CODE_INFOS = 'algoplus-review-note-code-infos';
const REVIEW_NOTE_SELECTED_SUBMISSIONS_IDS =
    'algoplus-review-note-selected-submission-ids';

export const saveCodeInfosToStorage = async (
    problemId: string,
    codeInfos: CodeInfo[]
) => {
    syncReviewNoteStorage(problemId);
    const storedProblemId = (await getObjectFromLocalStorage(
        REVIEW_NOTE_PROBLEM_ID
    )) as string;
    if (!storedProblemId || problemId !== storedProblemId) {
        await saveObjectInLocalStorage({ [REVIEW_NOTE_PROBLEM_ID]: problemId });
        await saveObjectInLocalStorage({ [REVIEW_NOTE_CODE_INFOS]: [] });
        await saveObjectInLocalStorage({
            [REVIEW_NOTE_SELECTED_SUBMISSIONS_IDS]: [],
        });
    }

    const storedCodeInfos = (await getObjectFromLocalStorage(
        REVIEW_NOTE_CODE_INFOS
    )) as CodeInfo[];

    await saveObjectInLocalStorage({
        [REVIEW_NOTE_CODE_INFOS]: mergeCodeInfosWithoutDuplicate(
            storedCodeInfos,
            codeInfos
        ),
    });
};

export const loadCodeInfosFromStorage = async (problemId: string) => {
    if (!(await isProblemIdMatched(problemId))) {
        return [];
    }
    return await getObjectFromLocalStorage(REVIEW_NOTE_CODE_INFOS);
};

export const eraseCodeInfosInStorage = async () => {
    await removeObjectFromLocalStorage(REVIEW_NOTE_PROBLEM_ID);
    await removeObjectFromLocalStorage(REVIEW_NOTE_CODE_INFOS);
    await removeObjectFromLocalStorage(REVIEW_NOTE_SELECTED_SUBMISSIONS_IDS);
};

export const saveSelectedCodeToStorage = async (
    problemId: string,
    submissionIds: string[]
) => {
    syncReviewNoteStorage(problemId);
    await saveObjectInLocalStorage({
        [REVIEW_NOTE_SELECTED_SUBMISSIONS_IDS]: submissionIds,
    });
};

export const loadSelectedCodeFromStorage = async (problemId: string) => {
    if (!(await isProblemIdMatched(problemId))) {
        return [];
    }
    return await getObjectFromLocalStorage(
        REVIEW_NOTE_SELECTED_SUBMISSIONS_IDS
    );
};

const isProblemIdMatched = async (problemId: string): Promise<boolean> => {
    const storedProblemId = await getObjectFromLocalStorage(
        REVIEW_NOTE_PROBLEM_ID
    );
    return storedProblemId && problemId === storedProblemId;
};

const syncReviewNoteStorage = async (problemId: string) => {
    if (!isProblemIdMatched(problemId)) {
        await saveObjectInLocalStorage({ [REVIEW_NOTE_PROBLEM_ID]: problemId });
        await saveObjectInLocalStorage({ [REVIEW_NOTE_CODE_INFOS]: [] });
        await saveObjectInLocalStorage({
            [REVIEW_NOTE_SELECTED_SUBMISSIONS_IDS]: [],
        });
    }
};

const mergeCodeInfosWithoutDuplicate = (
    list1: CodeInfo[],
    list2: CodeInfo[]
): CodeInfo[] => {
    return [...list1, ...list2].reduce((acc: CodeInfo[], current) => {
        if (
            !acc.some(
                (codeInfo) => codeInfo.submissionId === current.submissionId
            )
        ) {
            acc.push(current);
        }
        return acc;
    }, []);
};
