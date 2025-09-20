import React from 'react';

const CodeNullContent = () => {
    return (
        <p style={{ textAlign: 'center', margin: 0, lineHeight: '16px' }}>
            오답노트를 작성할 코드를
            <br />
            선택하세요.
            <br />
            <span
                style={{
                    fontSize: '11px',
                    color: 'rgb(132 132 132)',
                }}
            >
                (최대 2개 선택 가능)
            </span>
        </p>
    );
};

export default CodeNullContent;
