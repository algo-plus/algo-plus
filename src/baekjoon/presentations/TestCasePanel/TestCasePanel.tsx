import TestCaseElement from '@/baekjoon/components/TestCaseElement/TestCaseElement';
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
                <p style={{ margin: '10px' }}>실행 결과가 여기에 표시됩니다.</p>
            ) : (
                testCases.map((testCase, index) => (
                    <TestCaseElement
                        key={index}
                        no={testCase.no}
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
