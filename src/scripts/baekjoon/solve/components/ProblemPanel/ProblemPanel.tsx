import React, { useEffect, useState } from 'react';
import './ProblemPanel.css';

const ProblemPanel: React.FC<{ problemId: string | null }> = ({
    problemId,
}) => {
    const [problemContent, setProblemContent] = useState<JSX.Element | null>(
        null
    );

    useEffect(() => {
        const fetchProblemDetail = async () => {
            try {
                const response = await fetch(
                    `https://www.acmicpc.net/problem/${problemId}`
                );
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const problemContainer = doc.querySelector(
                    '.container.content .row'
                ) as HTMLElement;

                if (problemContainer) {
                    problemContainer.style.margin = '0';

                    // 문제 메뉴 제거
                    const menu =
                        problemContainer.querySelector('ul.problem-menu');
                    if (menu && menu.parentNode)
                        menu.parentNode.removeChild(menu);

                    // 즐겨찾기 버튼 제거
                    const problemButton =
                        problemContainer.querySelector('.problem-button');
                    if (problemButton && problemButton.parentNode)
                        problemButton.parentNode.removeChild(problemButton);

                    // 알고리즘 분류 제거
                    const problemTag =
                        problemContainer.querySelector('#problem_tags');
                    if (problemTag && problemTag.parentNode)
                        problemTag.parentNode.removeChild(problemTag);

                    // 메모 제거
                    const problemMemo =
                        problemContainer.querySelector('#problem_memo');
                    if (problemMemo && problemMemo.parentNode)
                        problemMemo.parentNode.removeChild(problemMemo);

                    const content = (
                        <div
                            className='problem-content'
                            dangerouslySetInnerHTML={{
                                __html: problemContainer.innerHTML,
                            }}
                        ></div>
                    );
                    setProblemContent(content);
                } else {
                    setProblemContent(<h1>문제를 불러오는데 실패했습니다.</h1>);
                }
            } catch (error) {
                console.error('문제를 불러오는데 실패했습니다.', error);
                setProblemContent(<h1>문제를 불러오는데 실패했습니다.</h1>);
            }
        };

        if (problemId) {
            fetchProblemDetail();
        }
    }, [problemId]);

    return <>{problemContent}</>;
};

export default ProblemPanel;
