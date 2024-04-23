import React, { useState } from 'react';
import { PrismCodeEditor } from '../PrismCodeEditor';
import { Button } from '../Button';
import { SubmitPostRequest } from '../../../types/submit';
import { submit } from '../../../apis/submit';

const SolveView: React.FC<{ csrfKey: string | null }> = ({ csrfKey }) => {
    const [code, setCode] = useState('');

    const submitHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const data: SubmitPostRequest = {
            problem_id: 1000,
            language: 3,
            code_open: 'onlyaccepted',
            source: code,
            csrf_key: csrfKey ? csrfKey : '',
        };

        submit(
            data,
            (response) => {
                const responseURL = response.request.responseURL;
                if (responseURL) {
                    console.log('code submit... responseURL=' + responseURL);
                    // TODO: 코드 제출 후 로직 작성
                }
            },
            console.error
        );
    };

    return (
        <>
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{ background: 'black', height: '100%' }}>
                    <PrismCodeEditor
                        theme='github-dark'
                        language='java'
                        onUpdate={setCode}
                        tab-size='4'
                    />
                </div>
                <div
                    style={{
                        height: '70px',
                        display: 'flex',
                        justifyContent: 'right',
                        alignContent: 'center',
                        padding: '10px 0px',
                        gap: '10px',
                    }}
                >
                    <Button
                        text='테스트 케이스 추가'
                        onClick={() => alert('테스트 케이스 구현 중')}
                    />
                    <Button text='실행' onClick={() => alert('실행 구현중')} />
                    <Button text='제출' onClick={submitHandle} />
                </div>
            </div>
        </>
    );
};

export default SolveView;
