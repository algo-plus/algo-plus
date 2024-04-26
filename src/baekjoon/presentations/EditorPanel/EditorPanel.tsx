import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/baekjoon/components/Button';
import { CodeCompileRequest } from '@/common/types/compile';
import { compile } from '@/common/apis/compile';
import { PrismCodeEditor } from '@/baekjoon/components/PrismCodeEditor';
import { SubmitPostRequest } from '@/baekjoon/types/submit';
import { submit } from '@/baekjoon/apis/submit';
import { LanguageSelectBox } from '@/baekjoon/components/LanguageSelectBox';
import { CodeOpenSelector } from '@/baekjoon/components/CodeOpenSelector';
import { TestCase } from '@/baekjoon/types/problem';

interface EditorPanelProps {
    csrfKey: string | null;
    problemId: string | null;
    testCases: TestCase[];
}

const EditorPanel: React.FC<EditorPanelProps> = ({ csrfKey, problemId }) => {
    const [language, setLanguage] = useState('0'); // 초기 언어 설정
    const [codeOpen, setCodeOpen] = useState('close'); // 초기 소스코드 설정
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

    useEffect(() => {
        // 기존 에디터 숨기기
        const beforeEditor = document.querySelector(
            '#submit_form > div:nth-child(5) > div.col-md-10'
        ) as HTMLDivElement;
        if (beforeEditor) {
            beforeEditor.style.display = 'none';
        }

        // 기존 제출버튼 숨기기
        const beforeButton = document.querySelector(
            '#submit_form > div:nth-child(7) > div'
        ) as HTMLDivElement;
        if (beforeButton) {
            beforeButton.style.display = 'none';
        }

        const editorDiv: HTMLDivElement = document.createElement('div');
        editorDiv.id = 'editorContainer';
        const child = document.querySelector(
            '#submit_form > div:nth-child(5) > div.col-md-10'
        );
        document
            .querySelector('#submit_form > div:nth-child(5)')
            ?.insertBefore(editorDiv, child);

        const root = createRoot(editorDiv);
        root.render(
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
        );
    }, [csrfKey, language, codeOpen]); // csrfKey 또는 language가 변경될 때마다 실행

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage); // 선택된 언어 상태 업데이트
    };

    const handleCodeOpenChange = (value: string) => {
        setCodeOpen(value);
    };

    const submitHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (problemId === null) {
            alert('문제 정보를 불러올 수 없습니다.');
            return;
        }

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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <LanguageSelectBox
                    defaultValue='0'
                    onChange={handleLanguageChange}
                />
                <CodeOpenSelector
                    defaultValue={codeOpen}
                    onChange={handleCodeOpenChange}
                />
            </div>
            <div id='editorContainer' style={{ height: '70%' }}>
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
            </div>
        </>
    );
};

export default EditorPanel;
