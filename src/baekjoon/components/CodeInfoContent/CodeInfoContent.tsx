import React from 'react';
import './CodeInfoContent.css';

interface ProblemInfoModalProps {
    problemId: number;
    submissionNumber: number;
    memory: number;
    time: number;
    result: string;
    onClose: () => void;
}

const CodeInfoContent = ({
    problemId,
    submissionNumber,
    memory,
    time,
    result,
    onClose,
}: ProblemInfoModalProps) => {
    return (
        <>
            <h4 style={{ position: 'relative' }}>
                선택된 코드
                <button className='close-button' onClick={onClose}>
                    &#x2715; {/* X 문자 */}
                </button>
            </h4>
            <p>제출 번호: {submissionNumber}</p>
            {result === '맞았습니다!!' && (
                <>
                    <p>메모리: {memory} KB</p>
                    <p>시간: {time} ms</p>
                </>
            )}
            <p>결과: {result}</p>
        </>
    );
};

export default CodeInfoContent;
