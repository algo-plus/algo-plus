type CodeCompileRequest = {
    lang: CompilerLanguage;
    code: string;
    input?: string | null;
};

type CodeCompileRequest2 = {
    script: string;
    stdin?: string | null;
    language: CompilerLanguage2;
};

type CompilerLanguage =
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

type CompilerLanguage2 =
    | 'c'
    | 'cpp'
    | 'csharp'
    | 'java'
    | 'python3'
    | 'nodejs'
    | 'kotlin'
    | 'ruby'
    | 'swift'
    | 'go';

export type {
    CodeCompileRequest,
    CompilerLanguage,
    CodeCompileRequest2,
    CompilerLanguage2,
};
