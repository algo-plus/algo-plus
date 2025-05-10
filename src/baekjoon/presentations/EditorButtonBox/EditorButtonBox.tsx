import React from 'react';
import './EditorButtonBox.css';

const EditorButtonBox: React.FC<EditorButtonBoxProps> = ({
    codeInitializeHandle,
    openReferenceUrl,
    addTestCaseHandle,
    runHandle,
    submitHandle,
    isRunning,
    isSubmitting
}) => {
    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'right' }}>
            <button className='btn btn-default' onClick={codeInitializeHandle}>
                초기화
            </button>
            <button className='btn btn-default' onClick={openReferenceUrl}>
                공식 문서
            </button>
            <button className='btn btn-default' onClick={addTestCaseHandle}>
                테스트 케이스 추가
            </button>
            <button
                className={`btn btn-default ${isRunning ? 'loading' : ''}`}
                onClick={runHandle}
                disabled={isRunning}
            >
                {isRunning ? '실행 중...' : '실행'}
            </button>
            <button 
                className='btn btn-primary' 
                onClick={submitHandle}
                disabled={isSubmitting}
            >
                {isSubmitting ? '제출 중...' : '제출'}
            </button>
        </div>
    );
};

interface EditorButtonBoxProps {
    codeInitializeHandle: () => void;
    openReferenceUrl: () => void;
    addTestCaseHandle: () => void;
    runHandle: () => void;
    submitHandle: () => void;
    isRunning: boolean;
    isSubmitting: boolean;
}

export default EditorButtonBox;
