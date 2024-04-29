import React, { ChangeEvent } from 'react';

interface LanguageSelectBoxProps {
    defaultValue: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const LanguageSelectBox: React.FC<LanguageSelectBoxProps> = ({
    defaultValue,
    onChange,
}) => {
    return (
        <div
            style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'right',
                marginRight: '10px',
            }}
        >
            <label className='control-label'>언어</label>
            <div>
                <select
                    id='language'
                    name='language'
                    data-placeholder='언어를 선택해 주세요'
                    className='language-select chosen-select'
                    data-no_results_text='없는 언어 입니다'
                    defaultValue={defaultValue}
                    onChange={onChange}
                >
                    <option value='0' data-mime='text/x-csrc'>
                        C99
                    </option>
                    <option value='95' data-mime='text/x-c++src'>
                        C++20
                    </option>
                    <option value='86' data-mime='text/x-csharp'>
                        C#
                    </option>
                    <option value='3' data-mime='text/x-java'>
                        Java 8
                    </option>
                    <option value='93' data-mime='text/x-java'>
                        Java 11
                    </option>
                    <option value='28' data-mime='text/x-python'>
                        Python 3
                    </option>
                    <option value='73' data-mime='text/x-python'>
                        PyPy3
                    </option>
                    <option value='17' data-mime='text/javascript'>
                        node.js
                    </option>
                    <option value='69' data-mime='text/x-kotlin'>
                        Kotlin (JVM)
                    </option>
                    <option value='68' data-mime='text/x-ruby'>
                        Ruby
                    </option>
                    <option value='74' data-mime='text/x-swift'>
                        Swift
                    </option>
                    <option value='12' data-mime='text/x-go'>
                        Go
                    </option>
                    <option value='113' data-mime='text/x-rustsrc'>
                        Rust 2021
                    </option>
                </select>
            </div>
        </div>
    );
};

export default LanguageSelectBox;
