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
                    // 문제 메뉴, 즐겨찾기 버튼, 알고리즘 분류, 메모 제거
                    const elementsToRemove = [
                        'ul.problem-menu',
                        '.problem-button',
                        '#problem_tags',
                        '#problem_memo',
                    ];
                    elementsToRemove.forEach((selector) => {
                        const elem = problemContainer.querySelector(selector);
                        if (elem && elem.parentNode) {
                            elem.parentNode.removeChild(elem);
                        }
                    });

                    // 스타일 조정
                    problemContainer.style.margin = '0';

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
