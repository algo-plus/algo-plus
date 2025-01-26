import React, { useState } from 'react';
import './TestCaseElement.css';
import { TestCase } from '@/baekjoon/types/problem';

const TestCaseElement: React.FC<TestCaseElementProps> = ({
    no,
    testCase,
    disabled,
    onDelete,
}) => {
    const [rows, setRows] = useState(getOptimalRows());
    const resize = () => {
        setRows(getOptimalRows());
    };

    function getOptimalRows() {
        return Math.max(
            testCase.input.split('\n').length,
            testCase.output.split('\n').length
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                gap: '10px',
                margin: '10px 0',
            }}
        >
            <section className='test-case-element'>
                <div className='headline'>
                    <h2>예제 입력 {no}</h2>
                </div>
                <textarea
                    style={disabled ? {} : { background: '#fff' }}
                    disabled={disabled}
                    rows={rows}
                    defaultValue={testCase.input}
                    onChange={(event) => {
                        testCase.input = event.target.value;
                        resize();
                    }}
                    spellCheck='false'
                ></textarea>
            </section>
            <section className='test-case-element'>
                <div
                    className='headline'
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <h2>예제 출력 {no}</h2>
                    {disabled ? null : (
                        <button
                            className='btn btn-link'
                            onClick={() => {
                                testCase.uuid && onDelete?.(testCase.uuid);
                            }}
                        >
                            삭제
                        </button>
                    )}
                </div>
                <textarea
                    style={disabled ? {} : { background: '#fff' }}
                    disabled={disabled}
                    rows={rows}
                    defaultValue={testCase.output}
                    onChange={(event) => {
                        testCase.output = event.target.value;
                        resize();
                    }}
                    spellCheck='false'
                ></textarea>
            </section>
        </div>
    );
};

type TestCaseElementProps = {
    no: number;
    testCase: TestCase;
    disabled: boolean;
    onDelete?: (uuid: string) => void;
};

export default TestCaseElement;
