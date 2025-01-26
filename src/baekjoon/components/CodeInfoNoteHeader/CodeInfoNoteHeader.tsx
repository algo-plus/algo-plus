import React from 'react';
import './CodeInfoNoteHeader.css';

interface CodeInfoNoteHeaderProps {
    submissionId: string;
    memory: string;
    time: string;
    language: string;
    result: string;
}

const CodeInfoNoteHeader = ({
    submissionId,
    memory,
    time,
    language,
    result,
}: CodeInfoNoteHeaderProps) => {
    return (
        <div className='algoplus-code-info-header'>
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

export default CodeInfoNoteHeader;
