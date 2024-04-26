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

type SolveViewProps = {
    problemId: string | null;
    csrfKey: string | null;
};

const SolveView: React.FC<SolveViewProps> = (props: SolveViewProps) => {
    const [problemContent, setProblemContent] = useState<JSX.Element | null>(
        null
    );
    const [testCases, setTestCases] = useState<TestCase[]>([]);

    useEffect(() => {
        fetchProblemHtml(
            props.problemId,
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

    return (
        <HorizontalSplitView
            left={<ProblemPanel content={problemContent} />}
            right={
                <VerticalSplitView
                    top={
                        <EditorPanel
                            problemId={props.problemId}
                            csrfKey={props.csrfKey}
                            testCases={testCases}
                        />
                    }
                    bottom={<TestCasePanel testCases={testCases} />}
                />
            }
        />
    );
};

export default SolveView;
