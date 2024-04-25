import React, { useState } from 'react';
import { PrismCodeEditor } from '../PrismCodeEditor';
import { Button } from '../Button';
import { SubmitPostRequest } from '../../../types/submit';
import { submit } from '../../../apis/submit';
import { CodeCompileRequest } from '@/types/compile';
import { compile } from '@/apis/compile';

interface SolveViewProps {
    csrfKey: string | null;
    language: string;
    codeOpen: string;
    problemId: number;
}

const SolveView: React.FC<SolveViewProps> = ({
    csrfKey,
    language,
    codeOpen,
    problemId,
}) => {
    const [code, setCode] = useState('');

    const languageMap: Record<string, string> = {
        '0': 'c',
        '95': 'cpp',
        '86': 'csharp',
        '3': 'java',
        '93': 'java',
        '28': 'python',
        '73': 'python',
        '17': 'js',
        '69': 'kotlin',
        '68': 'ruby',
        '74': 'swift',
        '12': 'go',
        '113': 'rust',
    };

    const selectedLanguage = languageMap[language] || 'c';

    // TODO: 더미 데이터 호출 삭제
    const testCaseRunHandle = (event: any) => {
        event.preventDefault();
        const data: CodeCompileRequest = {
            lang: 'java',
            code: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        System.out.println("두 수의 합 = " + (a + b));\n        scanner.close();\n    }\n}            \n            ',
            input: '5 6',
        };
        compile(
            data,
            (value) => alert((value as any)['output']),
            (error) => console.log('error =', error)
        );
    };

    const submitHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const data: SubmitPostRequest = {
            problem_id: problemId,
            language: Number(language),
            code_open: codeOpen,
            source: code,
            csrf_key: csrfKey ? csrfKey : '',
        };

        submit(
            data,
            (response) => {
                const responseURL = response.request.responseURL;
                if (responseURL) {
                    console.log('code submit... responseURL=' + responseURL);
                    // TODO: 코드 제출 후 로직 작성
                }
            },
            console.error
        );
    };

    return (
        <>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        background: 'black',
                        height: '100%',
                        maxWidth: '100%',
                        maxHeight: '700px',
                        overflowY: 'auto',
                        fontSize: '18px',
                    }}
                >
                    <PrismCodeEditor
                        theme='vs-code-dark'
                        language={selectedLanguage}
                        onUpdate={setCode}
                    />
                </div>
                <div
                    style={{
                        height: '70px',
                        display: 'flex',
                        justifyContent: 'right',
                        alignContent: 'center',
                        padding: '10px 0px',
                        gap: '10px',
                    }}
                >
                    <Button
                        text='테스트 케이스 추가'
                        onClick={() => alert('테스트 케이스 구현 중')}
                    />
                    <Button text='실행' onClick={testCaseRunHandle} />
                    <Button text='제출' onClick={submitHandle} />
                </div>
            </div>
        </>
    );
};

export default SolveView;
