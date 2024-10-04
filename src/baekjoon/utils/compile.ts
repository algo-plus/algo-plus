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

/* JDoodle compile API 동작 후 처리가 필요한 경우 출력 결과를 후처리 */
const postprecessOutput = (
    language: CompilerLanguage,
    output: string
): string => {
    if (output.includes('JDoodle.kt') && !output.startsWith('\nJDoodle.kt')) {
        output = output.split('JDoodle.kt')[0];
    }
    if (language === 'csharp' && output.includes('0 Error(s)')) {
        const parts = output.split('Time Elapsed')[1].split('\n', 1);
        output = parts.length > 1 ? parts[1] : parts[0];
    }
    if (output.includes('JDoodle - output Limit reached.')) {
        output = '출력 초과';
    }
    if (
        output.includes('JDOODLE_TIMEOUT_LIMIT_EXCEEDED') ||
        output.includes('JDoodle - Timeout')
    ) {
        output = '시간 초과';
    }
    return output;
};

const checkCompileError = (lang: CompilerLanguage, output: string): boolean => {
    return output.includes(CompileErrorFormatConvertMap[lang]);
};

export { preprocessSourceCode, postprecessOutput, checkCompileError };
