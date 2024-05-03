import React, { useState } from 'react';
import { PrismCodeEditor } from '@/baekjoon/components/PrismCodeEditor';
import { EditorLanguage } from '@/common/types/language';
import './EditorPanel.css';

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
    const [theme, setTheme] = useState<Theme>('vs-code-light');

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
                    (theme === 'vs-code-dark' ? '#1F1F1F' : '#cccccc'),
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
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() =>
                    setTheme(
                        theme === 'vs-code-dark'
                            ? 'vs-code-light'
                            : 'vs-code-dark'
                    )
                }
            >
                테마 변경
            </button>
        </div>
    );
};

type Theme = 'vs-code-dark' | 'vs-code-light';

export default EditorPanel;
