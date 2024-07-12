type CodeCompileRequest = {
    script: string;
    stdin?: string | null;
    language: CompilerLanguage;
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

export type {
    CodeCompileRequest,
    CompilerLanguage
};
