import ReactDOM from 'react-dom';
import 'prism-code-editor/prism/languages/javascript';
import 'prism-code-editor/prism/languages/java';
import React, { useState } from 'react';
import axios from 'axios';

import { PrismCodeEditor } from './solve/components/PrismCodeEditor';
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
            <button onClick={submitHandle}>버튼</button>
        </>
    );
};

const customSubmitPage = () => {
    console.log('custom problem page...');

    const editorDiv: HTMLDivElement = document.createElement('div');
    editorDiv.id = 'editorContainer';
    const child = document.querySelector('#submit_form > div:nth-child(5) > div.col-md-10')
    document.querySelector('#submit_form > div:nth-child(5)')?.insertBefore(editorDiv, child);

    const root = createRoot(editorDiv);
    root.render(<SolveView />);
};

export default customSubmitPage;