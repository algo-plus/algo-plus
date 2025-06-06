import React, { useEffect, useState } from 'react';
import { PrismCodeEditor } from '@/baekjoon/components/PrismCodeEditor';
import { EditorLanguage } from '@/common/types/language';
import './EditorPanel.css';
import { loadTheme, saveTheme } from '@/baekjoon/utils/storage/editor';

interface EditorPanelProps {
    code: string;
    language: EditorLanguage;
    onCodeUpdate: (code: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
    code,
    language,
    onCodeUpdate,
}) => {
    const sunIcon = '☀️';
    const moonIcon = '🌙';
    const [theme, setTheme] = useState<Theme>('vs-code-dark');

    useEffect(() => {
        loadTheme().then((theme) => setTheme(theme as Theme));
    }, []);

    useEffect(() => {
        saveTheme(theme);
        if (theme === 'vs-code-dark') {
            document.body.classList.add('algoplus-dark-theme');
            document.body.classList.remove('algoplus-light-theme');
        } else {
            document.body.classList.remove('algoplus-dark-theme');
            document.body.classList.add('algoplus-light-theme');
        }
    }, [theme]);

    return (
        <div
            className='scroll-disabled'
            style={{
                background: theme === 'vs-code-dark' ? '#1F1F1F' : '#FFFFFF',
                height: '100%',
                maxWidth: '100%',
                overflowY: 'auto',
                fontSize: '16px',
                border:
                    '1px solid ' +
                    (theme === 'vs-code-dark' ? '#3F3F3F' : '#cccccc'),
            }}
        >
            <PrismCodeEditor
                tabSize={4}
                theme={theme}
                language={language}
                value={code}
                onUpdate={onCodeUpdate}
            />
            <button
                className='theme-change-button'
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor:
                        theme === 'vs-code-dark' ? '#ffffff30' : '#00000030',
                }}
                onClick={() =>
                    setTheme(
                        theme === 'vs-code-dark'
                            ? 'vs-code-light'
                            : 'vs-code-dark'
                    )
                }
            >
                {theme === 'vs-code-dark' ? moonIcon : sunIcon}
            </button>
        </div>
    );
};

type Theme = 'vs-code-dark' | 'vs-code-light';

export default EditorPanel;
