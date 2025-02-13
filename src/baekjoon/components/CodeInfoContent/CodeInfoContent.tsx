import React from 'react';
import './CodeInfoContent.css';

interface CodeInfoContentProps {
    submissionId: string;
    memory: string;
    time: string;
    language: string;
    result: string;
    onClose: () => void;
}

const CodeInfoContent = ({
    submissionId,
    memory,
    time,
    result,
    language,
    onClose,
}: CodeInfoContentProps) => {
    return (
        <div className='algoplus-code-info-content'>
            <button className='close-button' onClick={onClose}>
                &#x2715;
            </button>
            <p>
                제출 번호 : <b>{submissionId}</b>
            </p>
            <p>언어 : {language}</p>
            <p>
                결과 :&nbsp;
                <span
                    className={`result-text ${
                        result === '맞았습니다!!' ? 'result-ac' : 'result-wa'
                    }`}
                >
                    {result}
                </span>
            </p>
            <p style={{ fontSize: '12px' }}>
                {memory ? (
                    <span>
                        메모리 : {memory}{' '}
                        <span style={{ color: '#e74c3c' }}>KB</span> /{' '}
                    </span>
                ) : (
                    <></>
                )}
                {time ? (
                    <span>
                        시간 : {time}{' '}
                        <span style={{ color: '#e74c3c' }}>ms</span>
                    </span>
                ) : (
                    <></>
                )}
            </p>
        </div>
    );
};

export default CodeInfoContent;
