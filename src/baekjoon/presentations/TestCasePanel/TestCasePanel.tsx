import TestCaseResultElement from '@/baekjoon/components/TestCaseResultElement/TestCaseResultElement';
import { TestCase } from '@/baekjoon/types/problem';
import { replaceSpaceAndNewlineToHtml } from '@/common/utils/string';
import React from 'react';

interface TestCasePanelProps {
    testCases: TestCase[];
    state: 'initial' | 'run' | 'error';
    errorMessage?: string;
}

const TestCasePanel: React.FC<TestCasePanelProps> = ({
    testCases,
    state,
    errorMessage,
}) => {
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
            ) : state === 'error' && errorMessage ? (
                <p
                    className='test-case-panel-error-message'
                    style={{ padding: '10px', color: 'red' }}
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: replaceSpaceAndNewlineToHtml(errorMessage),
                        }}
                    ></span>
                </p>
            ) : (
                testCases.map((testCase, index) => (
                    <TestCaseResultElement
                        key={index}
                        no={index + 1}
                        input={testCase.input}
                        expectedValue={testCase.output}
                        output={testCase.result}
                        isMultiAnswer={testCase.isMultiAnswer}
                    />
                ))
            )}
        </div>
    );
};

export default TestCasePanel;
