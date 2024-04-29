import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/baekjoon/components/Button';
import { CodeCompileRequest } from '@/common/types/compile';
import { compile } from '@/common/apis/compile';
import { PrismCodeEditor } from '@/baekjoon/components/PrismCodeEditor';
import { SubmitPostRequest } from '@/baekjoon/types/submit';
import { submit } from '@/baekjoon/apis/submit';
import { LanguageSelectBox } from '@/baekjoon/components/LanguageSelectBox';
import { CodeOpenSelector } from '@/baekjoon/components/CodeOpenSelector';
import { TestCase } from '@/baekjoon/types/problem';
import { convertLanguageIdForSubmitApi } from '@/baekjoon/utils/language';
import './EditorPanel.css';

interface EditorPanelProps {
    onCodeUpdate: (code: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ onCodeUpdate }) => {
    const [language, setLanguage] = useState('0'); // 초기 언어 설정
    const [codeOpen, setCodeOpen] = useState('close'); // 초기 소스코드 설정

    const languageMap: Record<string, string> = {
        '0': 'c',
        '95': 'cpp',
        '86': 'csharp',
        '3': 'java',
        '93': 'java',
        '28': 'python',
        '73': 'python',
        '17': 'js',
        '69': 'kotlin',
        '68': 'ruby',
        '74': 'swift',
        '12': 'go',
        '113': 'rust',
    };

    const selectedLanguage = languageMap[language] || 'c';

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
            <div className='editor-panel'>
                <div className='editor'>
                    <PrismCodeEditor
                        theme='vs-code-dark'
                        language={selectedLanguage}
                        onUpdate={onCodeUpdate}
                    />
                </div>
                <div className='editor-button-container'>
                    <Button
                        text='테스트 케이스 추가'
                        onClick={() => alert('테스트 케이스 구현 중')}
                    />
                </div>
            </div>
        );
    }, [language, codeOpen]); // csrfKey 또는 language가 변경될 때마다 실행

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage); // 선택된 언어 상태 업데이트
    };

    const handleCodeOpenChange = (value: string) => {
        setCodeOpen(value);
    };

    return (
        <div
            className='scroll-disabled'
            style={{
                background: 'black',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '700px',
                overflowY: 'auto',
                fontSize: '16px',
            }}
        >
            <PrismCodeEditor
                theme='vs-code-dark'
                language={selectedLanguage}
                onUpdate={onCodeUpdate}
            />
        </div>
    );
};

export default EditorPanel;
