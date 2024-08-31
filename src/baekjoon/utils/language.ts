import { CompilerLanguage } from '@/common/types/compile';
import { EditorLanguage, ReferenceLanguage } from '@/common/types/language';

const submitApiLanguageConvertMap: Record<string, CompilerLanguage> = {
    '0': 'c',
    '75': 'c',
    '84': 'cpp',
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
    '75': 'c',
    '84': 'cpp',
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
    '0': 'c99',
    '75': 'c11',
    '84': 'cpp17',
    '95': 'cpp20',
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
