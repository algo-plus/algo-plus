import React from 'react';
import './CodeInfoModal.css';

interface ListModalProps {
    problemId: number;
    submissionNumber: number;
    memory: number;
    time: number;
    result: string;
    onSave: () => void;
}

const CodeInfoModal = ({
    problemId,
    submissionNumber,
    memory,
    time,
    result,
    onSave,
}: ListModalProps) => {
    return (
        <>
            <h4>선택된 코드</h4>
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
                onClick={onSave}
            >
                취소
            </button>
        </>
    );
};

export default CodeInfoModal;
