type TestCase = {
    uuid: string;
    input: string;
    output: string;
    result?: string;
};

type EditorCode = {
    languageId: string | number;
    code: string;
};

export { TestCase, EditorCode };
