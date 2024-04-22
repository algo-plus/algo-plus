import React, { useEffect, useState } from "react";

const ProblemPanel: React.FC<{ problemId: string | null }> = ({
    problemId,
}) => {
    const [problemHTML, setProblemHTML] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const fetchProblemDetail = async () => {
            try {
                const response = await fetch(
                    `https://www.acmicpc.net/problem/${problemId}`
                );
                const html = await response.text();
                const doc = new DOMParser().parseFromString(html, "text/html");
                const problemContainer = doc.querySelector(
                    ".container.content .row"
                ) as HTMLElement;
                setProblemHTML(problemContainer);
            } catch (error) {
                console.error("문제를 불러오는데 실패했습니다.", error);
            }
        };

        if (problemId) {
            fetchProblemDetail();
        }
    }, [problemId]);

    if (!problemHTML) {
        return <h1>문제를 불러오는 중입니다...</h1>;
    }

    return (
        <div
            style={{
                flex: "1",
                maxHeight: "100vh",
                overflowY: "auto",
                paddingRight: "10px",
            }}
        >
            {problemHTML != null ? (
                <>
                    {setProblemHTMLStyles(problemHTML)}
                    {problemHTML}
                </>
            ) : (
                <h1>문제를 불러오는데 실패했습니다.</h1>
            )}
        </div>
    );
};

const setProblemHTMLStyles = (problemHTML: HTMLElement): void => {
    // margin 없애기
    problemHTML.style.margin = "0";

    // 문제 메뉴 없애기
    const menu = problemHTML.querySelector("ul.problem-menu") as HTMLElement;
    if (menu && menu.parentNode) problemHTML.removeChild(menu.parentNode);

    // 즐겨찾기 버튼 없애기
    const problemButton = problemHTML.querySelector(
        ".problem-button"
    ) as HTMLElement;
    if (problemButton && problemButton.parentNode)
        problemButton.parentNode.removeChild(problemButton);

    // 알고리즘 분류 없애기
    const problemTag = problemHTML.querySelector(
        "#problem_tags"
    ) as HTMLElement;
    if (problemTag && problemTag.parentNode)
        problemHTML.removeChild(problemTag.parentNode);

    // 메모 없애기
    const problemMemo = problemHTML.querySelector(
        "#problem_memo"
    ) as HTMLElement;
    if (problemMemo && problemMemo.parentNode)
        problemHTML.removeChild(problemMemo.parentNode);
};

export default ProblemPanel;
