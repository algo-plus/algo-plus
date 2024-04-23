import 'prism-code-editor/prism/languages/javascript';
import 'prism-code-editor/prism/languages/java';
import React, { useState } from 'react';

import { PrismCodeEditor } from './solve/components/PrismCodeEditor';
import { createRoot } from 'react-dom/client';
import { SubmitPostRequest } from './types/submit';
import { submit } from './apis/submit';
import { Button } from './solve/components/Button';

const SolveView = () => {
    const [code, setCode] = useState('');

    const submitHandle = (event: any) => {
        event.preventDefault();
        const csrfKey = (
            document.querySelector(
                '#submit_form > input[type=hidden]:nth-child(6)'
            ) as HTMLInputElement
        ).value;

        // TODO: 문제번호, 언어, 코드공개여부 설정
        const data: SubmitPostRequest = {
            problem_id: 1000,
            language: 3,
            code_open: 'onlyaccepted',
            source: code,
            csrf_key: csrfKey,
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
            <PrismCodeEditor
                theme='github-dark'
                language='java'
                onUpdate={setCode}
            />
            <Button text='제출' onClick={submitHandle} />
        </>
    );
};

const customSubmitPage = () => {
    console.log('custom problem page...');

    // 기존 에디터 숨기기
    const beforeEditor = document.querySelector(
        '#submit_form > div:nth-child(5) > div.col-md-10'
    ) as HTMLDivElement;
    if (beforeEditor) {
        beforeEditor.style.display = 'none';
    }

    // 기존 제출버튼 숨기기
    const beforeButton = document.querySelector(
        '#submit_form > div:nth-child(7) > div'
    ) as HTMLDivElement;
    if (beforeButton) {
        beforeButton.style.display = 'none';
    }

    const editorDiv: HTMLDivElement = document.createElement('div');
    editorDiv.id = 'editorContainer';
    const child = document.querySelector(
        '#submit_form > div:nth-child(5) > div.col-md-10'
    );
    document
        .querySelector('#submit_form > div:nth-child(5)')
        ?.insertBefore(editorDiv, child);

    const root = createRoot(editorDiv);
    root.render(<SolveView />);
};

export default customSubmitPage;
