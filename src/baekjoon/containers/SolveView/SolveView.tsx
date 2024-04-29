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
import { convertLanguageIdForSubmitApi } from '@/baekjoon/utils/language';
import { CodeCompileRequest } from '@/common/types/compile';
import { CodeOpenSelector } from '@/baekjoon/components/CodeOpenSelector';

type SolveViewProps = {
    problemId: string | null;
    csrfKey: string | null;
};

const SolveView: React.FC<SolveViewProps> = ({ problemId, csrfKey }) => {
    const [problemContent, setProblemContent] = useState<JSX.Element | null>(
        null
    );
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [language, setLanguage] = useState('0'); // 초기 언어 설정
    const [codeOpen, setCodeOpen] = useState('close'); // 초기 소스코드 설정
    const [code, setCode] = useState('');

    const runHandle = () => {
        const lang = convertLanguageIdForSubmitApi(language);

        for (const testCase of testCases) {
            const data: CodeCompileRequest = {
                lang: lang,
                code: code,
                input: testCase.input,
            };

            // TODO: 테스트 케이스 콘솔을 화면 컴포넌트 새엇ㅇ 로직으로 변경
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

    const submitHandle = () => {
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
        setLanguage(selectedLanguage);
    };

    return (
        <div style={{ height: '100%' }}>
            <HorizontalSplitView
                left={<ProblemPanel content={problemContent} />}
                right={
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
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
                            top={<EditorPanel onCodeUpdate={setCode} />}
                            bottom={<TestCasePanel testCases={testCases} />}
                        />
                    </div>
                }
            />
            <EditorButtonBox
                codeInitializeHandle={() => alert('TODO: 코드 초기화 로직')}
                addTestCaseHandle={() => alert('TODO: 테스트 케이스 추가 모달')}
                runHandle={runHandle}
                submitHandle={submitHandle}
            />
        </div>
    );
};

export default SolveView;
