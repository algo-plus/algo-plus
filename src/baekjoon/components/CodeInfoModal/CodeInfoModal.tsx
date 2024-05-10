import React from 'react';
import './CodeInfoModal.css';

interface ProblemInfoModalProps {
    problemId: number;
    submissionNumber: number;
    memory: number;
    time: number;
    result: string;
    onClose: () => void;
}

const CodeInfoModal = ({
    problemId,
    submissionNumber,
    memory,
    time,
    result,
    onClose,
}: ProblemInfoModalProps) => {
    return (
        <>
            <h4>Code Info</h4>
            <p>제출 번호: {submissionNumber}</p>
            {result === '맞았습니다!!' && (
                <>
                    <p>메모리: {memory} KB</p>
                    <p>시간: {time} ms</p>
                </>
            )}
            <p>결과: {result}</p>
            <button
                type='button'
                className='btn btn-secondary'
                onClick={onClose}
            >
                취소
            </button>
        </>
    );
};

export default CodeInfoModal;
