type TestCase = {
    uuid: string;
    input: string;
    output: string;
    result?: string;
    isMultiAnswer?: boolean;
};

type EditorCode = {
    languageId: string | number;
    code: string;
};

export { TestCase, EditorCode };
