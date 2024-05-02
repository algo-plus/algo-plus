import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import './Modal.css';
import { ModalProps } from '@/baekjoon/types/source';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

let startLineIndex: number = -1;
let endLineIndex: number = -1;
let position: String = 'S-';

const Modal = (modalProps: ModalProps) => {
    const closeModal = () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        console.log('close modal');
    };
    const save = () => {
        console.log('save');
    };

    const oldCode = modalProps.sourceCodes[0]?.code || '';
    const newCode = modalProps.sourceCodes[1]?.code || '';

    const [selectedOldCode, setSelectedOldCode] = useState<string | null>(null);
    const [selectedNewCode, setSelectedNewCode] = useState<string | null>(null);
    const [oldCodeName, setOldCodeName] = useState<string>('첫 번째 코드');
    const [newCodeName, setNewCodeName] = useState<string>('두 번째 코드');

    const handleOldCodeNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setOldCodeName(event.target.value);
    };

    const handleNewCodeNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewCodeName(event.target.value);
    };

    const handleCloseCode = (codeType: 'old' | 'new') => {
        if (codeType === 'old') {
            setSelectedOldCode('');
        } else if (codeType === 'new') {
            setSelectedNewCode('');
        }
    };

    const handleLineNumberClick = (
        lineId: string,
        event: React.MouseEvent<HTMLTableCellElement>
    ) => {
        const linePrefix = lineId.substring(0, 2);
        const lineIndex = parseInt(lineId.substring(2), 10) - 1;

        if (position === 'S-') {
            position = linePrefix;
            startLineIndex = lineIndex;
            endLineIndex = lineIndex;
        } else {
            if (linePrefix === position) {
                if (lineIndex < startLineIndex) startLineIndex = lineIndex;
                else if (lineIndex > endLineIndex) endLineIndex = lineIndex;
                else if (lineIndex === startLineIndex) endLineIndex = lineIndex;
                else if (lineIndex === endLineIndex) startLineIndex = lineIndex;
                else endLineIndex = lineIndex;
            } else {
                position = linePrefix;
                startLineIndex = lineIndex;
                endLineIndex = lineIndex;
            }
        }

        let selectedCodeBlock = '';

        if (position == 'L-') {
            const codeArray = oldCode.split('\n');
            selectedCodeBlock = codeArray
                .slice(startLineIndex, endLineIndex + 1)
                .join('\n');
            setSelectedOldCode(selectedCodeBlock);
        } else if (position == 'R-') {
            const codeArray = newCode.split('\n');
            selectedCodeBlock = codeArray
                .slice(startLineIndex, endLineIndex + 1)
                .join('\n');
            setSelectedNewCode(selectedCodeBlock);
        }
    };

    return (
        <div className='modal-content'>
            <div className='modal-header' style={{ display: 'flex' }}>
                <h4 className='modal-title'>오답 노트 작성</h4>
                <button
                    type='button'
                    className='close'
                    data-dismiss='modal'
                    aria-label='Close'
                    onClick={closeModal}
                >
                    <span aria-hidden='true'>&times;</span>
                </button>
            </div>
            <div
                className='modal-body'
                style={{ overflowY: 'auto', maxHeight: '75vh' }}
            >
                <div className='codediff-container'>
                    <h5>코드 비교 결과:</h5>
                    <ReactDiffViewer
                        oldValue={oldCode ? oldCode : ''}
                        newValue={newCode ? newCode : ''}
                        compareMethod={DiffMethod.LINES}
                        splitView={true}
                        onLineNumberClick={handleLineNumberClick}
                        renderContent={(value) => {
                            return (
                                <Prism
                                    style={coy}
                                    language={
                                        modalProps.sourceCodes[0]?.lang || ''
                                    }
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
                <div>
                    <div>
                        {selectedOldCode && (
                            <div>
                                <h5>
                                    <input
                                        type='text'
                                        value={oldCodeName}
                                        onChange={handleOldCodeNameChange}
                                    />
                                </h5>
                                <button
                                    type='button'
                                    className='close'
                                    aria-label='Close'
                                    onClick={() => handleCloseCode('old')}
                                >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                                <pre>{selectedOldCode}</pre>
                            </div>
                        )}
                    </div>
                    <div></div>
                    <div>
                        {selectedNewCode && (
                            <div>
                                <h5>
                                    <input
                                        type='text'
                                        value={newCodeName}
                                        onChange={handleNewCodeNameChange}
                                    />
                                </h5>
                                <button
                                    type='button'
                                    className='close'
                                    aria-label='Close'
                                    onClick={() => handleCloseCode('new')}
                                >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                                <pre>{selectedNewCode}</pre>
                            </div>
                        )}
                    </div>
                    <div></div>
                    {(selectedOldCode || selectedNewCode) && (
                        <div>
                            <h5>코멘트</h5>
                            <textarea rows={4} cols={50}></textarea>
                        </div>
                    )}
                </div>
                <div>
                    <h5>전체 코멘트</h5>
                    <textarea rows={4} cols={50}></textarea>
                </div>
            </div>
            <div className='modal-footer'>
                <button
                    type='button'
                    className='btn btn-secondary'
                    data-dismiss='modal'
                    onClick={closeModal}
                >
                    취소
                </button>
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={save}
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default Modal;
