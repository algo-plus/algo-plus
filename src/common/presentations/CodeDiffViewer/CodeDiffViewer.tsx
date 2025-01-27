import React from 'react';
import {
    DiffViewerSide,
    DiffViewerSideType,
    SourceCode,
} from '@/common/types/source';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeDiffViewer.css';

type CodeDiffViewerProps = {
    sourceCodes: SourceCode[];
    handleRangeSelection: (
        side: DiffViewerSideType,
        range: number[],
        code: string
    ) => void;
};

const ReviewNoteModal: React.FC<CodeDiffViewerProps> = ({
    sourceCodes,
    handleRangeSelection,
}: CodeDiffViewerProps) => {
    const diffViewerStyles = {
        contentText: {
            background: 'transparent',
            padding: '0',
            border: '0',
        },
        lineNumber: {
            padding: '0 4px',
            border: '0',
        },
        gutter: {
            padding: '0',
        },
        marker: {
            background: 'transparent',
            border: '0',
            padding: '0 4px',
            '> pre': {
                border: '0',
                padding: '0',
                background: 'transparent',
            },
        },
    };
    const cursor: number[] = [-1, -1];

    const onLineNumberClick = (lineId: string) => {
        const splited = lineId.split('-');
        const side: DiffViewerSideType =
            splited[0] === 'L' ? DiffViewerSide.LEFT : DiffViewerSide.RIGHT;
        const line: number = Number(splited[1]);

        if (cursor[side] === -1) {
            cursor[side] = line;
        } else {
            const minIndex = Math.min(cursor[side], line) - 1;
            const maxIndex = Math.max(cursor[side], line);
            const code = sourceCodes[side].code
                ?.split('\n')
                .slice(minIndex, maxIndex)
                .join('\n');
            cursor[side] = -1;
            if (code) {
                handleRangeSelection(side, [minIndex, maxIndex], code);
            }
        }
    };

    return (
        <div className='algoplus-diff-viewer-container'>
            <ReactDiffViewer
                oldValue={sourceCodes[0]?.code || ''}
                newValue={sourceCodes[1]?.code || ''}
                compareMethod={DiffMethod.LINES}
                splitView={true}
                onLineNumberClick={onLineNumberClick}
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
