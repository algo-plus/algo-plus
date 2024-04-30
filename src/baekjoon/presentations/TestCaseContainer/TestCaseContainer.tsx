import { TestCaseElement } from '@/baekjoon/components/TestCaseElement';
import { TestCase } from '@/baekjoon/types/problem';
import React from 'react';

type TestCaseContainerProps = {
    testCases: TestCase[];
    customTestCases: TestCase[];
    onDeleteCustomTestCase: (uuid: string) => void;
};

const TestCaseContainer: React.FC<TestCaseContainerProps> = ({
    testCases,
    customTestCases,
    onDeleteCustomTestCase,
}) => {
    return (
        <div>
            {testCases.map((testCase, index) => (
                <TestCaseElement
                    no={index + 1}
                    testCase={testCase}
                    disabled={true}
                    key={testCase.uuid}
                />
            ))}
            {customTestCases.map((testCase, index) => (
                <TestCaseElement
                    no={testCases.length + index + 1}
                    testCase={testCase}
                    disabled={false}
                    key={testCase.uuid}
                    onDelete={onDeleteCustomTestCase}
                />
            ))}
        </div>
    );
};

export default TestCaseContainer;
