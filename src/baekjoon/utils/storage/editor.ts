import { EditorCode } from '@/baekjoon/types/problem';
import {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
} from '@/common/utils/storage';

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
        ['algoplus-editor-save-' + problemId]: data,
    });
};

const loadEditorCode = async (problemId: string): Promise<EditorCode> => {
    const key = 'algoplus-editor-save-' + problemId;
    const result = (await getObjectFromLocalStorage(key)) as EditorCode;
    return result;
};

export { saveEditorCode, loadEditorCode };
