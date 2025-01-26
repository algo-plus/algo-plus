import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import './ReviewModal.css';
import { ModalProps } from '@/common/types/source';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { startLoader } from '@/baekjoon/utils/baekjoon';
import { markdownReview } from '@/baekjoon/utils/review';
import { InfoModal } from '@/baekjoon/containers/InfoModal';
import { createRoot } from 'react-dom/client';
import {
    getHook,
    getObjectFromLocalStorage,
    getStats,
    getToken,
} from '@/common/utils/storage';
import { GitHub } from '@/baekjoon/utils/github';

let startLineIndex: number = -1;
let endLineIndex: number = -1;
let position: String = 'S-';

const ReviewModal = (modalProps: ModalProps) => {
    const [isInfoModalOpen, setInfoModalOpen] = useState(false);

    const closeModal = () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    };

    // const uploadCheck = async () => {

    // const token: any = await getToken();
    // const hook: any = await getHook();

    //  const git = new GitHub(hook, token);
    //  const stats: any = await getStats();

    //  let default_branch = stats.branches[hook];

    // stats.branches[hook] = default_branch ?? await git.getDefaultBranchOnRepo();

    //  const { refSHA, ref } = await git.getReference(default_branch);
    //  if(refSHA ==null && ref == null) {
    //     // 깃허브 업로드 버튼 없애기
    //     const target = document.querySelector('#githubUploadBtn');

    //     return;
    // }
    // }

    const changeOrderWarn = () => {
        if (confirm('작성한 내용이 사라집니다. 진행하시겠습니까?')) {
            changeOrder();
        }
    };

    const changeOrder = () => {
        closeModal();
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-backdrop';
        document.body.appendChild(modalDiv);
        const root = createRoot(modalDiv);
        const newModalProps = modalProps.sourceCodes.reverse();
        root.render(
            <React.StrictMode>
                <ReviewModal sourceCodes={newModalProps} />
            </React.StrictMode>
        );
    };

    const openInfoModal = () => {
        setInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setInfoModalOpen(false);
    };

    const upload = async () => {
        const enable = await getObjectFromLocalStorage('alpEnable');
        if (!enable) {
            alert('오답노트 작성을 위해서는 깃허브 연결이 필요합니다.');
            return enable;
        }

        const reviewMarkDownContent: ReviewMarkdownContent = {
            oldCode: oldCode,
            newCode: newCode,
            commentBlocks: codeBlocks,
            comment: comment,
        };
        startLoader(markdownReview(reviewMarkDownContent), closeModal);
    };

    const localSave = () => {
        const reviewMarkDownContent: ReviewMarkdownContent = {
            oldCode: oldCode,
            newCode: newCode,
            commentBlocks: codeBlocks,
            comment: comment,
        };

        chrome.runtime.sendMessage({
            action: 'saveRepository',
            content: markdownReview(reviewMarkDownContent),
        });
    };

    const oldCode = modalProps.sourceCodes[0]?.code || '';
    const newCode = modalProps.sourceCodes[1]?.code || '';

    const [codeBlocks, setCodeBlocks] = useState([
        {
            id: 0,
            selectedOldCode: '',
            selectedNewCode: '',
            oldCodeName: '이전 코드',
            newCodeName: '바뀐 코드',
            comment: '',
            isRegistered: false,
        },
    ]);

    const [comment, setComment] = useState('');

    const handleRegisterBlock = (id: number) => {
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

    const handleLineNumberClick = (lineId: string) => {
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
                    oldCodeName: '이전 코드',
                    newCodeName: '바뀐 코드',
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

    // TODO: Find another way to remove Bootstrap css.
    const newStyles = {
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
    // uploadCheck();

    return (
        <>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>오답 노트 작성</h4>
                    <div className='modal-header-buttons'>
                        {modalProps.sourceCodes.length > 1 && (
                            <button
                                type='button'
                                className='change'
                                aria-label='Change'
                                onClick={changeOrderWarn}
                            >
                                ⇄
                            </button>
                        )}
                        <button
                            type='button'
                            className='info'
                            aria-label='Info'
                            onClick={openInfoModal}
                        >
                            ⓘ
                        </button>
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
                </div>

                <InfoModal
                    modalOpen={isInfoModalOpen}
                    onClose={closeInfoModal}
                />

                <div className='modal-body' style={{ maxHeight: '75vh' }}>
                    <div className='codediff-container'>
                        <h5>코드 비교 결과:</h5>
                        <ReactDiffViewer
                            oldValue={oldCode ? oldCode : ''}
                            newValue={newCode ? newCode : ''}
                            compareMethod={DiffMethod.LINES}
                            splitView={true}
                            onLineNumberClick={handleLineNumberClick}
                            styles={newStyles}
                            renderContent={(value) => {
                                return (
                                    <Prism
                                        style={coy}
                                        language={
                                            modalProps.sourceCodes[0]?.lang ||
                                            ''
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
                    {codeBlocks.map((block) => (
                        <div key={block.id} className='code-block'>
                            {block.selectedOldCode && (
                                <div>
                                    <h5>
                                        <input
                                            type='text'
                                            className='code-name'
                                            value={block.oldCodeName}
                                            onChange={(e) =>
                                                handleOldCodeNameChange(
                                                    e,
                                                    block.id
                                                )
                                            }
                                            readOnly={block.isRegistered}
                                        />
                                        ✏
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
                                            className='code-name'
                                            value={block.newCodeName}
                                            onChange={(e) =>
                                                handleNewCodeNameChange(
                                                    e,
                                                    block.id
                                                )
                                            }
                                            readOnly={block.isRegistered}
                                        />
                                        🖊
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
                            {(block.selectedOldCode ||
                                block.selectedNewCode) && (
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
                                                updatedBlocks[
                                                    block.id
                                                ].comment = e.target.value;
                                                return updatedBlocks;
                                            });
                                        }}
                                        readOnly={block.isRegistered}
                                    ></textarea>
                                </div>
                            )}
                            <div className='code-block-button'>
                                {(block.selectedOldCode ||
                                    block.selectedNewCode) &&
                                    !block.isRegistered && (
                                        <div>
                                            <button
                                                type='button'
                                                className='btn btn-primary'
                                                onClick={() =>
                                                    handleRegisterBlock(
                                                        block.id
                                                    )
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
                                            className='btn btn-secondary'
                                            onClick={() =>
                                                handleDeleteBlock(block.id)
                                            }
                                        >
                                            삭제
                                        </button>
                                        <button
                                            type='button'
                                            className='btn btn-primary'
                                            onClick={() =>
                                                handleEditBlock(block.id)
                                            }
                                        >
                                            수정
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div>
                        <h5>전체 코멘트</h5>
                        <textarea
                            rows={4}
                            cols={50}
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                            }}
                        ></textarea>
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
                        id='githubUploadBtn'
                        onClick={upload}
                    >
                        깃허브 업로드
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary'
                        onClick={localSave}
                    >
                        로컬 저장
                    </button>
                </div>
                <div id='loaderModal' className='loader-modal'>
                    <div className='loader-content'>
                        <div className='loader'></div>
                    </div>
                </div>
            </div>
            <div id='uploadSuccessModal' className='upload-modal'>
                <div className='upload-modal-content'>
                    <p>업로드가 성공적으로 완료되었습니다!</p>
                </div>
            </div>
        </>
    );
};

export default ReviewModal;
