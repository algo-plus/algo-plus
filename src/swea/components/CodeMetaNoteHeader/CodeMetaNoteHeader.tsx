import React from 'react';
import './CodeMetaNoteHeader.css';
import { SweaCodeMeta } from '@/swea/types/source';

interface CodeMetaNoteHeader {
    codeMeta: SweaCodeMeta;
}

const CodeMetaNoteHeader = ({ codeMeta }: CodeMetaNoteHeader) => {
    return (
        <div className='algoplus-code-meta-header'>
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

export default CodeMetaNoteHeader;
