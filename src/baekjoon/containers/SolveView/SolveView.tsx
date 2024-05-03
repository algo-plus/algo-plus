import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProblemPanel } from '@/baekjoon/presentations/ProblemPanel';
import { EditorPanel } from '@/baekjoon/presentations/EditorPanel';
import { fetchProblemHtml } from '@/baekjoon/apis/problem';
import {
    parsingProblemDetail,
    parsingTestCases,
} from '@/baekjoon/utils/parsing';
import { EditorCode, TestCase } from '@/baekjoon/types/problem';
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
import { TestCaseModalButtonBox } from '@/baekjoon/presentations/TestCaseModalButtonBox';
import uuid from 'react-uuid';
import { TestCaseContainer } from '@/baekjoon/presentations/TestCaseContainer';
import {
    loadAndParseProblemDetail,
    loadAndParseProblemMathJaxStyle,
} from '@/baekjoon/utils/storage/problem';
import { addUrlSearchParam, refreshUrl } from '@/common/utils/url';
import {
    loadEditorCode,
    saveEditorCode,
} from '@/baekjoon/utils/storage/editor';
import { checkCompileError } from '@/baekjoon/utils/compile';

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
    const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
    const [languageId, setLanguageId] = useState<string>('0');
    const [focusLanguageId, setFocusLanguageId] = useState<string>('0');
    const [editorLanguage, setEditorLanguage] = useState<EditorLanguage>(
        convertLanguageIdForEditor(languageId)
    );
    const [codeOpen, setCodeOpen] = useState('close');
    const [code, setCode] = useState(getDefaultCode(editorLanguage));
    const [testCaseModalOpen, setTestCaseModalOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [testCaseState, setTestCaseState] = useState<
        'initial' | 'running' | 'result' | 'error'
    >('initial');
    const [targetTestCases, setTargetTestCases] = useState<TestCase[]>([]);
    const codeRef = useRef<string>(code);
    const languageIdRef = useRef<string>(languageId);

    const codeInitialize = () => {
        setCode(getDefaultCode(editorLanguage));
    };

    const toggleTestCaseModal = () => {
        setTestCaseModalOpen(!testCaseModalOpen);
    };

    const codeSaveToLocalStorage = (languageId: string, code: string) => {
        if (problemId) saveEditorCode(problemId, languageId, code);
        console.log(languageId, code);
    };

    const addTestCase = () => {
        if (customTestCases.length >= 10) {
            alert('테스트 케이스를 10개 이상 추가할 수 없습니다.');
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
    };

    const deleteTestCase = (uuid: string) => {
        setCustomTestCases([
            ...customTestCases.filter((tc) => tc.uuid !== uuid),
        ]);
    };

    // TODO: 로컬 스토리지에 테스트 케이스 저장 로직 작성
    const saveTestCase = () => {
        toggleTestCaseModal();
    };

    useEffect(() => {
        setTargetTestCases([...testCases]);
    }, [testCases]);

    const codeRun = async () => {
        if (!code) {
            alert('실행할 코드가 없습니다.');
            return;
        }

        codeSaveToLocalStorage(languageId, code);
        setTestCaseState('running');

        const lang = convertLanguageIdForSubmitApi(languageId);
        const currentTestCases = [...testCases, ...customTestCases];
        setTargetTestCases(currentTestCases);

        currentTestCases.forEach((testCase) => {
            testCase.result = undefined;
        });

        if (testCases.length > 0) {
            const data: CodeCompileRequest = {
                lang: lang,
                code: code,
                input: testCases[0].input,
            };

            try {
                const output = await compile(data);
                if (checkCompileError(lang, output)) {
                    setTestCaseState('error');
                    setErrorMessage(output);
                    return;
                } else {
                    testCases[0].result = output;
                }
            } catch (error) {
                setTestCaseState('error');
                setErrorMessage(
                    `컴파일 서버에서 오류가 발생했습니다.\n${error}`
                );
                return;
            }
        }

        await Promise.all(
            currentTestCases.slice(1).map(async (testCase) => {
                const data: CodeCompileRequest = {
                    lang: lang,
                    code: code,
                    input: testCase.input,
                };

                try {
                    const output = await compile(data);
                    testCase.result = output; // 결과 설정
                } catch (error) {
                    setTestCaseState('error');
                    setErrorMessage(
                        `코드 실행 중 오류가 발생했습니다.\n${error}`
                    );
                    return;
                }
            })
        );

        setTestCaseState('result');
    };

    const codeSubmit = () => {
        if (problemId === null) {
            alert('문제 정보를 불러올 수 없습니다.');
            return;
        }

        codeSaveToLocalStorage(languageId, code);
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
                    const redirectURL = addUrlSearchParam(
                        responseURL,
                        'after_algoplus_submit',
                        'true'
                    );
                    console.log('code submit... redirectURL=' + redirectURL);
                    refreshUrl(redirectURL);
                }
            },
            console.error
        );
    };

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
                const parsedTestCases = parsingTestCases(
                    loadedProblemContent.props.dangerouslySetInnerHTML.__html
                );
                setTestCases(parsedTestCases);
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
        if (!problemId) return;
        if (
            confirm(
                '언어 변경 시 작성 중인 코드가 지워집니다.\n변경하시겠습니까?'
            )
        ) {
            const selectedLanguage = event.target.value;
            const editorLanguage = convertLanguageIdForEditor(selectedLanguage);
            setLanguageId(selectedLanguage);
            setCode(getDefaultCode(editorLanguage));
            codeSaveToLocalStorage(languageId, code);
        } else {
            setLanguageId(focusLanguageId);
            const editorLanguage = convertLanguageIdForEditor(focusLanguageId);
            setEditorLanguage(editorLanguage);
        }
    };

    useEffect(() => {
        const editorLanguage = convertLanguageIdForEditor(languageId);
        setEditorLanguage(editorLanguage);
    }, [languageId]);

    useEffect(() => {
        if (!problemId) return;
        loadEditorCode(problemId).then((value: EditorCode) => {
            setLanguageId(value.languageId as string);
            setCode(value.code);
            console.log(value.code);
        });
    }, []);

    const languageFocusHandle = () => {
        setFocusLanguageId(languageId);
    };

    useEffect(() => {
        codeRef.current = code;
    }, [code]);

    useEffect(() => {
        languageIdRef.current = languageId;
    }, [languageId]);

    useEffect(() => {
        const tick = () => {
            console.log('editor code and language save.');
            codeSaveToLocalStorage(languageIdRef.current, codeRef.current);
        };

        const timerId = setInterval(tick, 60000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <>
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
                                    value={languageId}
                                    onChange={languageChangeHandle}
                                    onFocus={languageFocusHandle}
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
                                        testCases={targetTestCases}
                                        state={
                                            testCaseState == 'initial'
                                                ? 'initial'
                                                : testCaseState == 'error'
                                                ? 'error'
                                                : 'run'
                                        }
                                        errorMessage={errorMessage}
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
                    isRunning={testCaseState == 'running'}
                />
            </div>

            {/* 테스트 케이스 추가 모달 */}
            <Modal
                width={'80vw'}
                height={600}
                title={<h1>테스트 케이스 추가</h1>}
                content={
                    <TestCaseContainer
                        testCases={testCases}
                        customTestCases={customTestCases}
                        onDeleteCustomTestCase={deleteTestCase}
                    />
                }
                footer={
                    <TestCaseModalButtonBox
                        addTestCaseHandle={addTestCase}
                        saveTestCaseHandle={saveTestCase}
                    />
                }
                modalOpen={testCaseModalOpen}
                onClose={toggleTestCaseModal}
            />
        </>
    );
};

export default SolveView;
