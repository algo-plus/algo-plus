import ReactDOM from 'react-dom';
import 'prism-code-editor/prism/languages/javascript';
import 'prism-code-editor/prism/languages/java';
import React, { useState, CSSProperties } from 'react';
import axios from 'axios';

import { PrismCodeEditor } from './solve/components/PrismCodeEditor';
import { SubmitButtonStyle, ParentButtonStyle } from './solve/components/SubmitButtonStyle';
import { createRoot } from 'react-dom/client';

const SolveView = () => {
    const [code, setCode] = useState('');

    const submitHandle = (event: any) => {
        const csrfKey = (
            document.querySelector(
                '#submit_form > input[type=hidden]:nth-child(6)'
            ) as HTMLInputElement
        ).value;
        // alert(csrfKey);

        const data = {
            problem_id: 1000,
            language: 3,
            code_open: 'onlyaccepted',
            source: code,
            csrf_key: csrfKey,
        };

        console.log(data);

        event.preventDefault();
        axios
            .post('/submit/1000', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => console.error(error));
    };

    return (
        <>
            <PrismCodeEditor
                theme='github-dark'
                language='java' 
                onUpdate={setCode}
            />
            <div style={ParentButtonStyle as CSSProperties}><button style={SubmitButtonStyle as CSSProperties} onClick={submitHandle}>제출</button></div>
        </>
    );
};

const customSubmitPage = () => {
    console.log('custom problem page...');

    // 기존 에디터 숨기기
    const beforeEditor = document.querySelector('#submit_form > div:nth-child(5) > div.col-md-10') as HTMLDivElement;
    if (beforeEditor) {
        beforeEditor.style.display = 'none';
    }

    // 기존 제출버튼 숨기기
    const beforeButton = document.querySelector('#submit_form > div:nth-child(7) > div') as HTMLDivElement;
    if (beforeButton) {
        beforeButton.style.display = 'none';
    }

    const editorDiv: HTMLDivElement = document.createElement('div');
    editorDiv.id = 'editorContainer';
    const child = document.querySelector('#submit_form > div:nth-child(5) > div.col-md-10')
    document.querySelector('#submit_form > div:nth-child(5)')?.insertBefore(editorDiv, child);

    const root = createRoot(editorDiv);
    root.render(<SolveView />);
};

export default customSubmitPage;