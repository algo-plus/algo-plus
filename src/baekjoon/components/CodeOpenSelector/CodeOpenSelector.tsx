import React, { useState } from 'react';
import './CodeOpenSelector.css';
import { CodeOpen } from '@/baekjoon/types/submit';

interface CodeOpenProps {
    defaultValue: CodeOpen;
    onChange: (value: CodeOpen) => void;
}

const CodeOpenSelector: React.FC<CodeOpenProps> = ({
    defaultValue,
    onChange,
}) => {
    const [selectedValue, setSelectedValue] = useState<CodeOpen>(defaultValue);
    const handleCodeOpenChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const codeOpen = event.target.value as CodeOpen;
        onChange(codeOpen);
        setSelectedValue(codeOpen);
    };

    return (
        <div
            style={{ display: 'flex', gap: '20px', margin: '5px 0' }}
            className='code-open-selector'
        >
            <label className='control-label' htmlFor='code_open'>
                소스 코드 공개
            </label>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}
            >
                <div>
                    <label className='code-open-selector-element'>
                        <input
                            type='radio'
                            name='code_open'
                            value='open'
                            checked={selectedValue === 'open'}
                            onChange={handleCodeOpenChange}
                        />
                        공개
                    </label>
                </div>
                <div>
                    <label className='code-open-selector-element'>
                        <input
                            type='radio'
                            name='code_open'
                            value='close'
                            checked={selectedValue === 'close'}
                            onChange={handleCodeOpenChange}
                        />
                        비공개
                    </label>
                </div>
                <div>
                    <label className='code-open-selector-element'>
                        <input
                            type='radio'
                            name='code_open'
                            value='onlyaccepted'
                            checked={selectedValue === 'onlyaccepted'}
                            onChange={handleCodeOpenChange}
                        />
                        맞았을 때만 공개
                    </label>
                </div>
            </div>
        </div>
    );
};

export default CodeOpenSelector;
