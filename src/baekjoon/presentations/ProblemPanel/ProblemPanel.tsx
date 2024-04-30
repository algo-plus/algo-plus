import React from 'react';
import './ProblemPanel.css';

const ProblemPanel: React.FC<{
    content: JSX.Element | null;
    mathJaxStyle: JSX.Element | null;
}> = ({ content, mathJaxStyle }) => {
    if (mathJaxStyle) {
        const style = document.createElement('style');
        style.innerHTML = mathJaxStyle.props.children;
        document.head.appendChild(style);
    }

    return <>{content}</>;
};

export default ProblemPanel;
