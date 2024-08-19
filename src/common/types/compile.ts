type CodeCompileRequest = {
    lang: CompilerLanguage;
    code: string;
    input?: string | null;
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

export type { CodeCompileRequest, CompilerLanguage };
