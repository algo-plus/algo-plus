import React from 'react';
import './TestCaseResultElement.css';
import { replaceNewLineToBrTag } from '@/common/utils/string';

const TestCaseResultElement: React.FC<TestCaseResultElementProps> = ({
    no,
    input,
    output,
    expectedValue,
}) => {
    return (
        <div className='test-case-elem'>
            <h4>테스트{no}</h4>
            <p>
                <span>입력값</span>
                <span
                    dangerouslySetInnerHTML={{
                        __html: replaceNewLineToBrTag(input),
                    }}
                ></span>
            </p>
            <p>
                <span>기댓값</span>
                <span
                    dangerouslySetInnerHTML={{
                        __html: replaceNewLineToBrTag(expectedValue),
                    }}
                ></span>
            </p>
            <p>
                <span>실행 결과</span>
                <span
                    style={
                        output == expectedValue
                            ? { color: 'blue' }
                            : { color: 'red' }
                    }
                >
                    {output == expectedValue
                        ? '테스트를 통과하였습니다.'
                        : '테스트를 통과하지 못하였습니다.'}
                </span>
            </p>
            {output == expectedValue ? null : (
                <p>
                    <span>출력</span>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: replaceNewLineToBrTag(output),
                        }}
                    ></span>
                </p>
            )}
        </div>
    );
};

type TestCaseResultElementProps = {
    no: number | string;
    input: string;
    output: string;
    expectedValue: string;
};

export default TestCaseResultElement;
