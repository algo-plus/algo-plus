import React from 'react';
import './ProblemPanel.css';

const ProblemPanel: React.FC<{ content: JSX.Element | null }> = ({
    content,
}) => {
    return <>{content}</>;
};

export default ProblemPanel;
