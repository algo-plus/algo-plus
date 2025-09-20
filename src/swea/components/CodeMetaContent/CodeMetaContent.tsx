import React from 'react';
import './CodeMetaContent.css';
import { SweaCodeMeta } from '@/swea/types/source';

interface CodeInfoContentProps {
    codeMeta: SweaCodeMeta;
    onClose: () => void;
}

const CodeMetaContent = ({ codeMeta, onClose }: CodeInfoContentProps) => {
    return (
        <div className='algoplus-code-meta-content'>
            <button className='close-button' onClick={onClose}>
                &#x2715;
            </button>
            <p>
                제출회차 : <b>{codeMeta.submitIndexLabel}</b>
            </p>
            <p>
                결과 :&nbsp;
                <span
                    className={`${
                        codeMeta.result.includes('Pass') ? 'pass' : 'fail'
                    }`}
                >
                    {codeMeta.result}
                </span>
            </p>
            <p>
                {codeMeta.submitTime ? (
                    <span>제출시간 : {codeMeta.submitTime}</span>
                ) : (
                    <></>
                )}
            </p>
        </div>
    );
};

export default CodeMetaContent;
