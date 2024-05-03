import { EditorCode, TestCase } from '@/baekjoon/types/problem';
import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';

const EDITOR_CODE_STORAGE_PREFIX = 'algoplus-editor-save-';
const TEST_CASE_STORAGE_PREFIX = 'algoplus-test-case-';

const saveEditorCode = async (
    problemId: string | number,
    languageId: string | number,
    code: string
) => {
    const data: EditorCode = {
        languageId: languageId,
        code: code,
    };
    await saveObjectInLocalStorage({
        [EDITOR_CODE_STORAGE_PREFIX + problemId]: data,
    });
};

const loadEditorCode = async (
    problemId: string | number
): Promise<EditorCode> => {
    const key = EDITOR_CODE_STORAGE_PREFIX + problemId;
    const result = (await getObjectFromLocalStorage(key)) as EditorCode;
    return result;
};

const saveTestCases = async (
    problemId: string | number,
    testCases: TestCase[]
) => {
    await saveObjectInLocalStorage({
        [TEST_CASE_STORAGE_PREFIX + problemId]: testCases,
    });
};

const loadTestCases = async (
    problemId: string | number
): Promise<TestCase[]> => {
    const key = TEST_CASE_STORAGE_PREFIX + problemId;
    const result = (await getObjectFromLocalStorage(key)) as TestCase[];
    return result ? result : [];
};

export { saveEditorCode, loadEditorCode, saveTestCases, loadTestCases };
