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

const errorMessages: string[] = [
    `Algo Plus - 서비스 이용 한도 초과 안내\n
    현재 이용량 증가로 인해 일일 코드 실행 호출 한도가 초과되었습니다.
    한도는 매일 오전 9시에 자동으로 초기화됩니다.\n
    더 나은 서비스와 안정적인 환경을 제공하기 위해 최선을 다하겠습니다.
    너른 양해 부탁드립니다.`,
    '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    '올바르지 않은 요청입니다. 같은 문제가 계속 발생한다면 관리자에게 문의해주세요.\n\n문의: algoplus.official@gmail.com',
];

const trimLineByLine = (text: string): string => {
    return text
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
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
    if (language === 'java' && output.includes('Note: Main.java')) {
        output = output.split('Note: Main.java')[0];
    }
    if (
        language === 'csharp' &&
        output.includes('Compilation succeeded') &&
        output.includes('warning(s)')
    ) {
        const parts = output.split('warning(s)')[1].split('jdoodle.cs')[0];

        const answer = parts
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        output = answer.length > 0 ? answer[0] : '';
    }
    if (language === 'swift' && output.includes(': warning: ')) {
        output = output.split('\njdoodle.swift')[0];
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

const checkServerError = (output: string): boolean => {
    return errorMessages.includes(output);
};

const processErrorCode = (status: number): string => {
    if (status == 429) {
        return errorMessages[0];
    } else if (status < 410) {
        return errorMessages[2];
    }
    return errorMessages[1];
};

export {
    trimLineByLine,
    preprocessSourceCode,
    postprecessOutput,
    checkCompileError,
    checkServerError,
    processErrorCode,
};
