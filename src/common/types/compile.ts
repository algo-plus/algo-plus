type CodeCompileRequest = {
    language: CompilerLanguage;
    script: string;
    versionIndex: string;
    clientId: string;
    clientSecret: string;
    stdin?: string | null;
    compileOnly?: boolean;
    key?: string;
};

type CompilerLanguage =
    | 'c'
    | 'cpp17'
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
