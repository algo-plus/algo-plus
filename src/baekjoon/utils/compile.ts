import { CompilerLanguage } from '@/common/types/compile';

const CompileErrorFormatConvertMap: Record<CompilerLanguage, string> = {
    c: 'prog.c:',
    c_cpp: 'prog.cpp:',
    csharp: './prog.cs',
    java: 'submission/Main.java',
    python: 'File "./prog.py',
    nodejs: '/tmp/',
    kotlin: 'OpenJDK 64-Bit Server VM warning:',
    ruby: '# _/tmp/',
    swift: './prog.rb',
    golang: '# _/tmp/',
};

const checkCompileError = (lang: CompilerLanguage, output: string): boolean => {
    return output.startsWith(CompileErrorFormatConvertMap[lang]);
};

export { checkCompileError };
