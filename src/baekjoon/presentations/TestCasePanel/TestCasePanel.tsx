import TestCaseResultElement from '@/baekjoon/components/TestCaseResultElement/TestCaseResultElement';
import { TestCase } from '@/baekjoon/types/problem';
import React from 'react';

interface TestCasePanelProps {
    testCases: TestCase[];
    state: 'initial' | 'run';
}

const TestCasePanel: React.FC<TestCasePanelProps> = ({ testCases, state }) => {
    return (
        <div
            style={{
                minHeight: '100%',
            }}
        >
            {state === 'initial' ? (
                <p style={{ padding: '10px' }}>
                    실행 결과가 여기에 표시됩니다.
                </p>
            ) : (
                testCases.map((testCase, index) => (
                    <TestCaseResultElement
                        key={index}
                        no={index + 1}
                        input={testCase.input}
                        expectedValue={testCase.output}
                        output=''
                    />
                ))
            )}
        </div>
    );
};

export default TestCasePanel;
