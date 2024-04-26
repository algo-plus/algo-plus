import React, { useEffect, useState } from 'react';
import './ProblemPanel.css';
import { fetchProblemHtml } from '@/baekjoon/apis/problem';
import { parsingProblemDetail } from '@/baekjoon/utils/parsing';

const ProblemPanel: React.FC<{ content: JSX.Element | null }> = ({
    content,
}) => {
    return <>{content}</>;
};

export default ProblemPanel;
