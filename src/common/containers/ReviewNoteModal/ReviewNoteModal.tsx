import React, { useEffect, useState } from 'react';
import './ReviewNoteModal.css';
import { Modal } from '@/common/presentations/Modal';
import {
    CodeBlock,
    DiffViewerSide,
    DiffViewerSideType,
    SourceCode,
} from '@/common/types/source';
import { CodeDiffViewer } from '@/common/presentations/CodeDiffViewer';
import { Button } from '@/common/components/Button';
import { ReviewWriteBlock } from '@/common/presentations/ReviewWriteBlock';

type ReviewNoteModalProps = {
    modalOpen: boolean;
    onClose: () => void;
    codeDescriptions: (string | JSX.Element)[];
    sourceCodes: SourceCode[];
};

const ReviewNoteModal: React.FC<ReviewNoteModalProps> = (
    props: ReviewNoteModalProps
) => {
    const buttonCommonStyle: React.CSSProperties = {
        width: '100px',
    };
    const [sourceCodes, setSourceCodes] = useState<SourceCode[]>([]);
    const [codeDescriptions, setCodeDescriptions] = useState<
        (string | JSX.Element)[]
    >([]);
    const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
    const [currentCodeBlock, setCurrentCodeBlock] = useState<CodeBlock>(
        new CodeBlock()
    );

    useEffect(() => {
        setSourceCodes(props.sourceCodes);
        setCodeDescriptions(props.codeDescriptions);
    }, [props.sourceCodes, props.codeDescriptions]);

    const changeOrder = () => {
        if (confirm('작성한 내용이 사라집니다. 진행하시겠습니까?')) {
            setSourceCodes((prev) => [...prev].reverse());
            setCodeDescriptions((prev) => [...prev].reverse());
        }
    };

    const handleRangeSelection = (
        side: DiffViewerSideType,
        range: number[],
        code: string
    ) => {
        setCurrentCodeBlock({
            ...currentCodeBlock,
            [side === DiffViewerSide.LEFT ? 'oldCode' : 'newCode']: code,
        });
    };

    useEffect(() => console.log(codeBlocks), [codeBlocks]);

    return (
        <Modal
            title={<h1 style={{ textAlign: 'center' }}>오답노트 작성</h1>}
            content={
                <>
                    <div className='algoplus-review-note-content'>
                        <div className='code-description'>
                            {codeDescriptions[0]}
                            {codeDescriptions[1]}
                            <button
                                className='change-order-button'
                                onClick={changeOrder}
                            >
                                ⇄
                            </button>
                        </div>
                        <CodeDiffViewer
                            sourceCodes={sourceCodes}
                            handleRangeSelection={handleRangeSelection}
                        />
                        <hr />
                        <div className='review-note'>
                            <ReviewWriteBlock
                                codeBlock={currentCodeBlock}
                                setCodeBlock={setCurrentCodeBlock}
                                onRegistReviewBlock={(codeBlock) => {
                                    console.log(codeBlock);
                                }}
                            />
                        </div>
                    </div>
                </>
            }
            footer={
                <div className='algoplus-review-note-button-box'>
                    <Button
                        style={{ ...buttonCommonStyle }}
                        text='깃허브 업로드'
                        onClick={() => {}}
                    />
                    <Button
                        style={{ ...buttonCommonStyle }}
                        text='파일로 저장'
                        onClick={() => {}}
                    />
                </div>
            }
            modalOpen={props.modalOpen}
            onClose={props.onClose}
        />
    );
};

export default ReviewNoteModal;
