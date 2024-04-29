import React from 'react';

const EditorButtonBox: React.FC<EditorButtonBoxProps> = ({
    codeInitializeHandle,
    addTestCaseHandle,
    runHandle,
    submitHandle,
}) => {
    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'right' }}>
            <button className='btn btn-default' onClick={codeInitializeHandle}>
                초기화
            </button>
            <button className='btn btn-default' onClick={addTestCaseHandle}>
                테스트 케이스 추가
            </button>
            <button className='btn btn-default' onClick={runHandle}>
                실행
            </button>
            <button className='btn btn-primary' onClick={submitHandle}>
                제출
            </button>
        </div>
    );
};

interface EditorButtonBoxProps {
    codeInitializeHandle: () => void;
    addTestCaseHandle: () => void;
    runHandle: () => void;
    submitHandle: () => void;
}

export default EditorButtonBox;
