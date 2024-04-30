import React from 'react';
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
    return (
        <div
            className='scroll-disabled'
            style={{
                background: '#1F1F1F',
                height: '100%',
                maxWidth: '100%',
                overflowY: 'auto',
                fontSize: '16px',
            }}
        >
            <PrismCodeEditor
                tabSize={4}
                theme='vs-code-dark'
                language={language}
                value={code}
                onUpdate={onCodeUpdate}
            />
        </div>
    );
};

export default EditorPanel;
