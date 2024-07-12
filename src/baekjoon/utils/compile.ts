import { CompilerLanguage, CompilerLanguage2 } from '@/common/types/compile';

// TODO: update jdoodle api

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

const CompileErrorFormatConvertMap2: Record<CompilerLanguage2, string> = {
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
    return output.startsWith(CompileErrorFormatConvertMap[lang]);
};

const checkCompileError2 = (lang: CompilerLanguage2, output: string): boolean => {
    return output.startsWith(CompileErrorFormatConvertMap2[lang]);
};

export { checkCompileError, checkCompileError2 };
