import { CompilerLanguage } from '@/common/types/compile';

const CompileErrorFormatConvertMap: Record<CompilerLanguage, string> = {
    c: 'prog.c',
    c_cpp: 'prog.cpp',
    csharp: './prog.cs',
    java: 'submission/Main.java',
    python: 'File "./prog.py',
    nodejs: '/tmp/',
    kotlin: 'prog.kt',
    ruby: './prog.rb',
    swift: 'prog.swift',
    golang: './prog.go',
};

const checkCompileError = (lang: CompilerLanguage, output: string): boolean => {
    return output.includes(CompileErrorFormatConvertMap[lang]);
};

export { checkCompileError };
