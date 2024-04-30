import React, { useState, useRef, useEffect } from 'react';
import { ProblemPanel } from '@/baekjoon/presentations/ProblemPanel';
import { EditorPanel } from '@/baekjoon/presentations/EditorPanel';
import { fetchProblemHtml } from '@/baekjoon/apis/problem';
import {
    parsingProblemDetail,
    parsingTestCases,
} from '@/baekjoon/utils/parsing';
import { TestCase } from '@/baekjoon/types/problem';
import { HorizontalSplitView } from '@/baekjoon/presentations/HorizontalSplitView';
import { VerticalSplitView } from '@/baekjoon/presentations/VerticalSplitView';
import TestCasePanel from '@/baekjoon/presentations/TestCasePanel/TestCasePanel';
import EditorButtonBox from '@/baekjoon/presentations/EditorButtonBox/EditorButtonBox';
import { LanguageSelectBox } from '@/baekjoon/components/LanguageSelectBox';
import { SubmitPostRequest } from '@/baekjoon/types/submit';
import { submit } from '@/baekjoon/apis/submit';
import { compile } from '@/common/apis/compile';
import {
    convertLanguageIdForEditor,
    convertLanguageIdForSubmitApi,
} from '@/baekjoon/utils/language';
import { CodeCompileRequest } from '@/common/types/compile';
import { CodeOpenSelector } from '@/baekjoon/components/CodeOpenSelector';
import { getDefaultCode } from '@/common/utils/default-code';
import { EditorLanguage } from '@/common/types/language';
import {
    loadAndParseProblemDetail,
    loadAndParseProblemMathJaxStyle,
} from '@/baekjoon/utils/storage';

type SolveViewProps = {
    problemId: string | null;
    csrfKey: string | null;
};

const SolveView: React.FC<SolveViewProps> = ({ problemId, csrfKey }) => {
    const [problemContent, setProblemContent] = useState<JSX.Element | null>(
        null
    );
    const [problemStyle, setProblemStyle] = useState<JSX.Element | null>(null);
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [languageId, setLanguageId] = useState('0');
    const [editorLanguage, setEditorLanguage] = useState<EditorLanguage>(
        convertLanguageIdForEditor(languageId)
    );
    const [codeOpen, setCodeOpen] = useState('close');
    const [code, setCode] = useState(getDefaultCode(editorLanguage));

    const codeInitialize = () => {
        setCode(getDefaultCode(editorLanguage));
    };

    const codeRun = () => {
        if (!code) {
            alert('실행할 코드가 없습니다.');
            return;
        }

        // temporary log
        console.log(code);
        return;

        const lang = convertLanguageIdForSubmitApi(languageId);

        for (const testCase of testCases) {
            const data: CodeCompileRequest = {
                lang: lang,
                code: code,
                input: testCase.input,
            };

            // TODO: 테스트 케이스 콘솔을 화면 컴포넌트 생성 로직으로 변경
            compile(
                data,
                (output) => {
                    console.log(
                        `======= 테스트 케이스 ${testCase.no} ========`
                    );
                    console.log(`output=${output}`);
                    console.log(`expect=${testCase.output}`);
                    console.log(
                        `result=${
                            output == testCase.output
                                ? '맞았습니다!'
                                : '틀렸습니다'
                        }`
                    );
                },
                (error) => console.log('error =', error)
            );
        }
    };

    const codeSubmit = () => {
        if (problemId === null) {
            alert('문제 정보를 불러올 수 없습니다.');
            return;
        }

        const data: SubmitPostRequest = {
            problem_id: problemId,
            language: Number(languageId),
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

    useEffect(() => {
        const editorLanguage = convertLanguageIdForEditor(languageId);
        setEditorLanguage(editorLanguage);
        setCode(getDefaultCode(editorLanguage));
    }, [languageId]);

    useEffect(() => {
        const loadProblemData = async () => {
            if (!problemId) return;
            const loadedProblemContent = await loadAndParseProblemDetail(
                problemId
            );
            const loadedProblemStyle = await loadAndParseProblemMathJaxStyle(
                problemId
            );

            if (loadedProblemContent) {
                setProblemContent(loadedProblemContent);
                setProblemStyle(loadedProblemStyle);
            } else {
                fetchProblemHtml(
                    problemId,
                    async (html) => {
                        const parsedContent = parsingProblemDetail(html);
                        setProblemContent(parsedContent);
                        const parsedTestCases = parsingTestCases(html);
                        setTestCases(parsedTestCases);
                    },
                    (error) => {
                        console.error('문제를 불러오는데 실패했습니다.', error);
                        setProblemContent(
                            <h1>문제를 불러오는데 실패했습니다.</h1>
                        );
                    }
                );
            }
        };

        if (problemId) {
            loadProblemData();
        }
    }, [problemId]);

    const languageChangeHandle = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedLanguage = event.target.value;
        setLanguageId(selectedLanguage);
    };

    return (
        <div style={{ height: '100%' }}>
            <HorizontalSplitView
                left={
                    <ProblemPanel
                        content={problemContent}
                        mathJaxStyle={problemStyle}
                    />
                }
                right={
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                            }}
                        >
                            {/* TODO: 코드 공개 여부 백준 사용자 설정 값으로 지정 */}
                            <CodeOpenSelector
                                defaultValue={codeOpen}
                                onChange={setCodeOpen}
                            />
                            <LanguageSelectBox
                                defaultValue='0'
                                onChange={languageChangeHandle}
                            />
                        </div>
                        <VerticalSplitView
                            top={
                                <EditorPanel
                                    language={editorLanguage}
                                    code={code}
                                    onCodeUpdate={setCode}
                                />
                            }
                            bottom={
                                <TestCasePanel
                                    testCases={testCases}
                                    state='initial'
                                />
                            }
                            bottomStyle={{
                                border: '1px solid #ccc',
                                background: '#efefef',
                            }}
                        />
                    </div>
                }
            />
            <EditorButtonBox
                codeInitializeHandle={() => {
                    if (confirm('정말로 초기화하시겠습니까?')) {
                        codeInitialize();
                    }
                }}
                addTestCaseHandle={() => alert('TODO: 테스트 케이스 추가 모달')}
                runHandle={codeRun}
                submitHandle={codeSubmit}
            />
        </div>
    );
};

export default SolveView;
