const submitApiLanguageConvertMap: Record<string, string> = {
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
    '113': 'rust',
};

function convertLanguageIdForSubmitApi(languageId: string): any {
    return submitApiLanguageConvertMap[languageId];
}

export { convertLanguageIdForSubmitApi };
