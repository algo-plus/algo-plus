import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import './Modal.css';
import { ModalProps } from '@/baekjoon/types/source';

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

    const oldCode = modalProps.sourceCodes[0] || '';
    const newCode = modalProps.sourceCodes[1] || '';

    const [codeBlocks, setCodeBlocks] = useState([
        {
            id: 0,
            selectedOldCode: '',
            selectedNewCode: '',
            oldCodeName: '첫 번째 코드',
            newCodeName: '두 번째 코드',
            comment: '',
            isRegistered: false,
        },
    ]);

    const handleRegisterBlock = (id: number) => {
        // 선택된 블록을 등록완료로 변경
        setCodeBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[id].isRegistered = true;
            return updatedBlocks;
        });
        position = 'S-';
    };

    const handleEditBlock = (id: number) => {
        setCodeBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[id].isRegistered = false;
            return updatedBlocks;
        });
        position = 'S-';
    };

    const handleOldCodeNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        id: number
    ) => {
        setCodeBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[id].oldCodeName = event.target.value;
            return updatedBlocks;
        });
    };

    const handleNewCodeNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        id: number
    ) => {
        setCodeBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            updatedBlocks[id].newCodeName = event.target.value;
            return updatedBlocks;
        });
    };

    const handleCloseCode = (codeType: 'old' | 'new', id: number) => {
        setCodeBlocks((prevBlocks) => {
            const updatedBlocks = [...prevBlocks];
            const blockIndex = updatedBlocks.findIndex(
                (block) => block.id === id
            );
            if (blockIndex !== -1) {
                if (codeType === 'old') {
                    updatedBlocks[blockIndex].selectedOldCode = '';
                } else if (codeType === 'new') {
                    updatedBlocks[blockIndex].selectedNewCode = '';
                }
            }

            if (
                updatedBlocks[blockIndex].selectedOldCode === '' &&
                updatedBlocks[blockIndex].selectedNewCode === ''
            ) {
                handleDeleteBlock(id);
            }
            return updatedBlocks;
        });
    };

    const handleDeleteBlock = (id: number) => {
        const prevBlocks = codeBlocks.filter((block) => block.id !== id);
        for (let i = 0; i < prevBlocks.length; i++) {
            prevBlocks[i].id = i;
        }
        setCodeBlocks(prevBlocks);
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

        let selectedOldCodeBlock = '';
        let selectedNewCodeBlock = '';
        const updatedBlocks = [...codeBlocks];
        const lastBlock = updatedBlocks[updatedBlocks.length - 1];

        if (position == 'L-') {
            const codeArray = oldCode.split('\n');
            selectedOldCodeBlock = codeArray
                .slice(startLineIndex, endLineIndex + 1)
                .join('\n');
        } else if (position == 'R-') {
            const codeArray = newCode.split('\n');
            selectedNewCodeBlock = codeArray
                .slice(startLineIndex, endLineIndex + 1)
                .join('\n');
        }

        // 새로운 블록 생성
        if (codeBlocks.length == 0 || lastBlock.isRegistered) {
            setCodeBlocks([
                ...codeBlocks,
                {
                    id: codeBlocks.length,
                    selectedOldCode: '',
                    selectedNewCode: '',
                    oldCodeName: '첫 번째 코드',
                    newCodeName: '두 번째 코드',
                    comment: '',
                    isRegistered: false,
                },
            ]);
        }

        let blockIndex = -1;
        for (let i = 0; i < codeBlocks.length; i++) {
            if (!codeBlocks[i].isRegistered) {
                blockIndex = i;
                break;
            }
        }
        if (blockIndex == -1) {
            blockIndex = codeBlocks.length;
        }

        if (position == 'L-') {
            setCodeBlocks((prevBlocks) => {
                const updatedBlocks = [...prevBlocks];
                updatedBlocks[blockIndex].selectedOldCode =
                    selectedOldCodeBlock;
                return updatedBlocks;
            });
        } else if (position == 'R-') {
            setCodeBlocks((prevBlocks) => {
                const updatedBlocks = [...prevBlocks];
                updatedBlocks[blockIndex].selectedNewCode =
                    selectedNewCodeBlock;
                return updatedBlocks;
            });
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
                    />
                </div>
                {codeBlocks.map((block) => (
                    <div key={block.id}>
                        {block.selectedOldCode && (
                            <div>
                                <h5>
                                    <input
                                        type='text'
                                        value={block.oldCodeName}
                                        onChange={(e) =>
                                            handleOldCodeNameChange(e, block.id)
                                        }
                                        readOnly={block.isRegistered}
                                    />
                                </h5>
                                <button
                                    type='button'
                                    className='close'
                                    aria-label='Close'
                                    onClick={() =>
                                        handleCloseCode('old', block.id)
                                    }
                                >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                                <pre>{block.selectedOldCode}</pre>
                            </div>
                        )}
                        {block.selectedNewCode && (
                            <div>
                                <h5>
                                    <input
                                        type='text'
                                        value={block.newCodeName}
                                        onChange={(e) =>
                                            handleNewCodeNameChange(e, block.id)
                                        }
                                        readOnly={block.isRegistered}
                                    />
                                </h5>
                                <button
                                    type='button'
                                    className='close'
                                    aria-label='Close'
                                    onClick={() =>
                                        handleCloseCode('new', block.id)
                                    }
                                >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                                <pre>{block.selectedNewCode}</pre>
                            </div>
                        )}
                        {(block.selectedOldCode || block.selectedNewCode) && (
                            <div>
                                <h5>코멘트</h5>
                                <textarea
                                    rows={4}
                                    cols={50}
                                    value={block.comment}
                                    onChange={(e) => {
                                        setCodeBlocks((prevBlocks) => {
                                            const updatedBlocks = [
                                                ...prevBlocks,
                                            ];
                                            updatedBlocks[block.id].comment =
                                                e.target.value;
                                            return updatedBlocks;
                                        });
                                    }}
                                    readOnly={block.isRegistered}
                                ></textarea>
                            </div>
                        )}
                        {(block.selectedOldCode || block.selectedNewCode) &&
                            !block.isRegistered && (
                                <div>
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        onClick={() =>
                                            handleRegisterBlock(block.id)
                                        }
                                    >
                                        등록
                                    </button>
                                </div>
                            )}
                        {block.isRegistered && (
                            <div>
                                <button
                                    type='button'
                                    className='btn btn-warning'
                                    onClick={() => handleEditBlock(block.id)}
                                >
                                    수정
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-danger'
                                    onClick={() => handleDeleteBlock(block.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                ))}
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
