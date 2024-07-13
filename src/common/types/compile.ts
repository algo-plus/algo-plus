type CodeCompileRequest = {
    lang: CompilerLanguage;
    code: string;
    input?: string | null;
};

type CompilerLanguage =
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

export type { CodeCompileRequest, CompilerLanguage };
