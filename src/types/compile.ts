type CodeCompileRequest = {
    lang:
        | 'c'
        | 'c_cpp'
        | 'csharp'
        | 'java'
        | 'python'
        | 'nodejs'
        | 'kotlin'
        | 'ruby'
        | 'swift'
        | 'golang';
    code: string;
    input: string;
};

export type { CodeCompileRequest };
