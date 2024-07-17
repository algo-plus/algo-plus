import { CompilerLanguage } from '@/common/types/compile';

const CompileErrorFormatConvertMap: Record<CompilerLanguage, string> = {
    c: 'prog.c:',
    cpp: 'prog.cpp:',
    csharp: './prog.cs',
    java: 'submission/Main.java',
    python3: 'File "./prog.py',
    nodejs: '/tmp/',
    kotlin: 'OpenJDK 64-Bit Server VM warning:',
    ruby: '# _/tmp/',
    swift: './prog.rb',
    go: '# _/tmp/',
};

const checkCompileError = (lang: CompilerLanguage, output: string): boolean => {
    return output.includes(CompileErrorFormatConvertMap[lang]);
};

export { checkCompileError };
