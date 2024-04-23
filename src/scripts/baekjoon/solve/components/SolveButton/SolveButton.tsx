import React from "react";

export const SolveButton = (props: { problemId: string | null }) => {
    const { problemId } = props;
    return <a href={`/submit/${problemId}?solve=true`}>문제 풀기</a>;
};

export default SolveButton;
