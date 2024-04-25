import React from 'react';

interface CodeOpenProps {
    defaultValue: string; // 초기 선택 값
    onChange: (value: string) => void; // 선택 변경 핸들러
}

const CodeOpen: React.FC<CodeOpenProps> = ({ defaultValue, onChange }) => {
    const handleCodeOpenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        onChange(selectedValue); // 선택된 값 상태 업데이트
    };

    return (
        <div className='form-group'>
            <label className='col-md-2 control-label' htmlFor='code_open'>
                소스 코드 공개
            </label>
            <div className='col-md-10'>
                <div className='radio'>
                    <label>
                        <input
                            type='radio'
                            name='code_open'
                            value='open'
                            checked={defaultValue === 'open'}
                            onChange={handleCodeOpenChange}
                        />
                        공개
                    </label>
                </div>
                <div className='radio'>
                    <label>
                        <input
                            type='radio'
                            name='code_open'
                            value='close'
                            checked={defaultValue === 'close'}
                            onChange={handleCodeOpenChange}
                        />
                        비공개
                    </label>
                </div>
                <div className='radio'>
                    <label>
                        <input
                            type='radio'
                            name='code_open'
                            value='onlyaccepted'
                            checked={defaultValue === 'onlyaccepted'}
                            onChange={handleCodeOpenChange}
                        />
                        맞았을 때만 공개
                    </label>
                </div>
            </div>
        </div>
    );
};

export default CodeOpen;
