import React from 'react';
import { SourceCode } from '@/common/types/source';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeDiffViewer.css';

type CodeDiffViewerProps = {
    sourceCodes: SourceCode[];
};

const ReviewNoteModal: React.FC<CodeDiffViewerProps> = ({
    sourceCodes,
}: CodeDiffViewerProps) => {
    // TODO: Find another way to remove Bootstrap css.
    const diffViewerStyles = {
        contentText: {
            background: 'transparent',
            border: '0',
        },
        lineNumber: {
            border: '0',
        },
        marker: {
            background: 'transparent',
            border: '0',
            '> pre': {
                border: '0',
                background: 'transparent',
            },
        },
    };

    return (
        <div className='algoplus-diff-viewer-container'>
            <ReactDiffViewer
                oldValue={sourceCodes[0]?.code || ''}
                newValue={sourceCodes[1]?.code || ''}
                compareMethod={DiffMethod.LINES}
                splitView={true}
                onLineNumberClick={() => {}}
                styles={diffViewerStyles}
                renderContent={(value) => {
                    return (
                        <Prism
                            style={coy}
                            language={sourceCodes[0]?.lang || ''}
                            wrapLongLines
                            wrapLines
                            PreTag='span'
                            customStyle={{
                                display: 'contents',
                                wordBreak: 'break-word',
                            }}
                            codeTagProps={{
                                style: {
                                    display: 'contents',
                                },
                            }}
                        >
                            {value}
                        </Prism>
                    );
                }}
            />
        </div>
    );
};

export default ReviewNoteModal;
