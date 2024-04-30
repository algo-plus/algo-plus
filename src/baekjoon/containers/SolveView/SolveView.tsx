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
import { Modal } from '@/baekjoon/presentations/Modal';
import { Button } from '@/baekjoon/components/Button';
import { TestCaseElement } from '@/baekjoon/components/TestCaseElement';
import uuid from 'react-uuid';

type SolveViewProps = {
    problemId: string | null;
    csrfKey: string | null;
};

const SolveView: React.FC<SolveViewProps> = ({ problemId, csrfKey }) => {
    const [problemContent, setProblemContent] = useState<JSX.Element | null>(
        null
    );
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
    const [languageId, setLanguageId] = useState('0');
    const [editorLanguage, setEditorLanguage] = useState<EditorLanguage>(
        convertLanguageIdForEditor(languageId)
    );
    const [codeOpen, setCodeOpen] = useState('close');
    const [code, setCode] = useState(getDefaultCode(editorLanguage));
    const [testCaseModalOpen, setTestCaseModalOpen] = useState<boolean>(false);

    const codeInitialize = () => {
        setCode(getDefaultCode(editorLanguage));
    };

    const toggleTestCaseModal = () => {
        setTestCaseModalOpen(!testCaseModalOpen);
    };

    const addTestCase = () => {};

    const codeRun = () => {
        if (!code) {
            alert('실행할 코드가 없습니다.');
            return;
        }

        // temporary log
        console.log(code);

        const lang = convertLanguageIdForSubmitApi(languageId);

        const targetTestCases = [...testCases, ...customTestCases];
        console.log(targetTestCases);
        for (const testCase of targetTestCases) {
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
                        `======= 테스트 케이스 ${testCase.uuid} ========`
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
        fetchProblemHtml(
            problemId,
            (html) => {
                setProblemContent(parsingProblemDetail(html));
                setTestCases(parsingTestCases(html));
            },
            (error) => {
                console.error('문제를 불러오는데 실패했습니다.', error);
                setProblemContent(<h1>문제를 불러오는데 실패했습니다.</h1>);
            }
        );
    }, []);

    const languageChangeHandle = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedLanguage = event.target.value;
        setLanguageId(selectedLanguage);
    };

    return (
        <>
            <div style={{ height: '100%' }}>
                <HorizontalSplitView
                    left={<ProblemPanel content={problemContent} />}
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
                    addTestCaseHandle={toggleTestCaseModal}
                    runHandle={codeRun}
                    submitHandle={codeSubmit}
                />
            </div>

            {/* 테스트 케이스 추가 모달 */}
            <Modal
                width={'80vw'}
                height={600}
                title={<h1>테스트 케이스 추가</h1>}
                content={
                    <>
                        {testCases.map((testCase, index) => (
                            <TestCaseElement
                                no={index + 1}
                                testCase={testCase}
                                disabled={true}
                                key={testCase.uuid}
                            />
                        ))}
                        {customTestCases.map((testCase, index) => (
                            <TestCaseElement
                                no={testCases.length + index + 1}
                                testCase={testCase}
                                disabled={false}
                                key={testCase.uuid}
                                onDelete={(uuid) =>
                                    setCustomTestCases([
                                        ...customTestCases.filter(
                                            (tc) => tc.uuid !== uuid
                                        ),
                                    ])
                                }
                            />
                        ))}
                    </>
                }
                footer={
                    <>
                        <button
                            className='btn btn-default'
                            onClick={() => {
                                if (customTestCases.length >= 10) {
                                    alert(
                                        '테스트 케이스를 10개 이상 추가할 수 없습니다.'
                                    );
                                    return;
                                }
                                setCustomTestCases([
                                    ...customTestCases,
                                    {
                                        uuid: uuid(),
                                        input: '',
                                        output: '',
                                    },
                                ]);
                            }}
                        >
                            + 추가
                        </button>
                        <button
                            className='btn btn-primary'
                            onClick={() => {
                                toggleTestCaseModal();
                            }}
                        >
                            저장
                        </button>
                    </>
                }
                modalOpen={testCaseModalOpen}
                onClose={toggleTestCaseModal}
            />
        </>
    );
};

export default SolveView;
