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
                <EditorPanel
                    problemId={props.problemId}
                    csrfKey={props.csrfKey}
                    testCases={testCases}
                />
            }
        />
    );
};

export default SolveView;
