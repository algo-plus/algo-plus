import React, { useState, useRef, useEffect } from 'react';
import { ProblemPanel } from '@/baekjoon/presentations/ProblemPanel';
import { EditorPanel } from '@/baekjoon/presentations/EditorPanel';
import { fetchProblemHtml } from '@/baekjoon/apis/problem';
import { parsingProblemDetail } from '@/baekjoon/utils/parsing';
import { SplitView } from '@/baekjoon/presentations/SplitView';

type SolveViewProps = {
    problemId: string | null;
    csrfKey: string | null;
};

const SolveView: React.FC<SolveViewProps> = (props: SolveViewProps) => {
    const [problemContent, setProblemContent] = useState<JSX.Element | null>(
        null
    );

    fetchProblemHtml(
        props.problemId,
        (html) => {
            setProblemContent(parsingProblemDetail(html));
        },
        (error) => {
            console.error('문제를 불러오는데 실패했습니다.', error);
            setProblemContent(<h1>문제를 불러오는데 실패했습니다.</h1>);
        }
    );

    return (
        <SplitView
            left={<ProblemPanel content={problemContent} />}
            right={
                <EditorPanel
                    problemId={props.problemId}
                    csrfKey={props.csrfKey}
                />
            }
        />
    );
};

export default SolveView;
