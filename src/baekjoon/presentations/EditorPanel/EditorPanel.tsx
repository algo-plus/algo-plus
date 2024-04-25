import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SolveView } from '@/baekjoon/presentations/SolveView';
import { LanguageSelectBox } from '@/baekjoon/components/LanguageSelectBox';
import { CodeOpenSelector } from '@/baekjoon/components/CodeOpenSelector';

interface EditorPanelProps {
    csrfKey: string | null;
    problemId: number;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ csrfKey, problemId }) => {
    const [language, setLanguage] = useState('0'); // 초기 언어 설정
    const [codeOpen, setCodeOpen] = useState('close'); // 초기 소스코드 설정

    useEffect(() => {
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
        root.render(
            <SolveView
                csrfKey={csrfKey}
                language={language}
                codeOpen={codeOpen}
                problemId={problemId}
            />
        );
    }, [csrfKey, language, codeOpen]); // csrfKey 또는 language가 변경될 때마다 실행

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage); // 선택된 언어 상태 업데이트
    };

    const handleCodeOpenChange = (value: string) => {
        setCodeOpen(value);
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <LanguageSelectBox
                    defaultValue='0'
                    onChange={handleLanguageChange}
                />
                <CodeOpenSelector
                    defaultValue={codeOpen}
                    onChange={handleCodeOpenChange}
                />
            </div>
            <div id='editorContainer' style={{ height: '70%' }}>
                <SolveView
                    csrfKey={csrfKey}
                    language={language}
                    codeOpen={codeOpen}
                    problemId={problemId}
                />
            </div>
        </>
    );
};

export default EditorPanel;
