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
import { convertLanguageIdForEditor } from '@/baekjoon/utils/language';
import './EditorPanel.css';
import { getDefaultCode } from '@/common/utils/default-code';
import { EditorLanguage } from '@/common/types/language';

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
