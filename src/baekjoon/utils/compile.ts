import { CompilerLanguage } from '@/common/types/compile';

const CompileErrorFormatConvertMap: Record<CompilerLanguage, string> = {
    c: 'main.c',
    cpp: 'jdoodle.cpp',
    csharp: '/home/Program.cs',
    java: 'Main.java',
    python3: '/home/jdoodle.py',
    nodejs: '/home/jdoodle.js',
    kotlin: 'JDoodle.kt',
    ruby: 'jdoodle.rb',
    swift: 'jdoodle.swift',
    go: 'jdoodle.go',
};

const checkCompileError = (lang: CompilerLanguage, output: string): boolean => {
    return output.includes(CompileErrorFormatConvertMap[lang]);
};

export { checkCompileError };
