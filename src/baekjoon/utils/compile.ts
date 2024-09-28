import { CompilerLanguage } from '@/common/types/compile';

const CompileErrorFormatConvertMap: Record<CompilerLanguage, string> = {
    c: 'main.c',
    cpp17: 'jdoodle.cpp',
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

/* JDoodle compile API 동작을 위한 별도의 처리가 필요한 경우 코드를 전처리 */
const preprocessSourceCode = (
    language: CompilerLanguage,
    code: string
): string => {
    if (language == 'kotlin') {
        code = '@file:JvmName("JDoodle")\n' + code;
    }
    return code;
};

const checkCompileError = (lang: CompilerLanguage, output: string): boolean => {
    return output.includes(CompileErrorFormatConvertMap[lang]);
};

export { preprocessSourceCode, checkCompileError };
