import { CompilerLanguage, CompilerLanguage2 } from '@/common/types/compile';
import { EditorLanguage, ReferenceLanguage } from '@/common/types/language';

// TODO: update jdoodle api

const submitApiLanguageConvertMap: Record<string, CompilerLanguage> = {
    '0': 'c',
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

const submitApiLanguageConvertMap2: Record<string, CompilerLanguage2> = {
    '0': 'c',
    '95': 'cpp',
    '86': 'csharp',
    '3': 'java',
    '93': 'java',
    '28': 'python3',
    '73': 'python3',
    '17': 'nodejs',
    '69': 'kotlin',
    '68': 'ruby',
    '74': 'swift',
    '12': 'go',
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

const ReferenceLanguageConvertMap: Record<string, ReferenceLanguage> = {
    '0': 'c',
    '95': 'cpp',
    '86': 'csharp',
    '3': 'java8',
    '93': 'java11',
    '28': 'python',
    '73': 'pypy',
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

export const convertLanguageIdForSubmitApi2 = (
    languageId: string
): CompilerLanguage2 => {
    return submitApiLanguageConvertMap2[languageId];
};

export const convertLanguageIdForEditor = (
    languageId: string
): EditorLanguage => {
    return editorLanguageConvertMap[languageId];
};

export const convertLanguageIdForReference = (
    languageId: string
): ReferenceLanguage => {
    return ReferenceLanguageConvertMap[languageId];
};
