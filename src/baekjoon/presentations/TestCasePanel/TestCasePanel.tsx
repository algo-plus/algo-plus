import TestCaseElement from '@/baekjoon/components/TestCaseElement/TestCaseElement';
import { TestCase } from '@/baekjoon/types/problem';
import React from 'react';

interface TestCasePanelProps {
    testCases: TestCase[];
}

const TestCasePanel: React.FC<TestCasePanelProps> = ({ testCases }) => {
    return (
        <>
            {testCases.map((testCase, index) => (
                <TestCaseElement
                    key={index}
                    no={testCase.no}
                    input={testCase.input}
                    expectedValue={testCase.output}
                    output=''
                />
            ))}
        </>
    );
};

export default TestCasePanel;
