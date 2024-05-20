import { CompilerLanguage } from '@/common/types/compile';
import { EditorLanguage } from '@/common/types/language';

const submitApiLanguageConvertMap: Record<string, CompilerLanguage> = {
    '0': 'c_cpp',
    '95': 'c_cpp',
    '86': 'csharp',
    '3': 'java',
    '93': 'java',
    '28': 'python',
    '73': 'python',
    '17': 'nodejs',
    '69': 'kotlin',
    '68': 'ruby',
    '74': 'swift',
    '12': 'golang',
};

const editorLanguageConvertMap: Record<string, EditorLanguage> = {
    '0': 'c',
    '95': 'cpp',
    '86': 'csharp',
    '3': 'java',
    '93': 'java',
    '28': 'python',
    '73': 'python',
    '17': 'js',
    '69': 'kotlin',
    '68': 'ruby',
    '74': 'swift',
    '12': 'go',
};

export const convertLanguageIdForSubmitApi = (
    languageId: string
): CompilerLanguage => {
    return submitApiLanguageConvertMap[languageId];
};

export const convertLanguageIdForEditor = (
    languageId: string
): EditorLanguage => {
    return editorLanguageConvertMap[languageId];
};
