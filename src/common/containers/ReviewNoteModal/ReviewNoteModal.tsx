import React, { useEffect, useState } from 'react';
import './ReviewNoteModal.css';
import { Modal } from '@/common/presentations/Modal';
import {
    CommentBlock,
    DiffViewerSide,
    DiffViewerSideType,
    ReviewMarkdownContent,
    SourceCode,
} from '@/common/types/source';
import { CodeDiffViewer } from '@/common/presentations/CodeDiffViewer';
import { Button } from '@/common/components/Button';
import { ReviewWriteBlock } from '@/common/presentations/ReviewWriteBlock';
import { ReviewNotes } from '@/common/presentations/ReviewNotes';
import ReviewOverallCommentBlock from '@/common/presentations/ReviewOverallCommentBlock/ReviewOverallCommentBlock';
import { markdownReview } from '@/baekjoon/utils/review';

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
    const [commentBlocks, setCommentBlocks] = useState<CommentBlock[]>([]);
    const [currentCommentBlock, setCurrentCommentBlock] =
        useState<CommentBlock>(new CommentBlock());
    const [comment, setComment] = useState<string>('');

    useEffect(() => {
        setSourceCodes(props.sourceCodes);
        setCodeDescriptions(props.codeDescriptions);
    }, [props.sourceCodes, props.codeDescriptions]);

    const addCommentBlock = (commentBlock: CommentBlock) => {
        setCommentBlocks((prevCommentBlocks) => [
            ...prevCommentBlocks,
            commentBlock,
        ]);
    };

    const deleteCommentBlock = (id: string) => {
        setCommentBlocks((prevCommentBlocks) =>
            prevCommentBlocks.filter((commentBlock) => commentBlock.id !== id)
        );
    };

    const changeOrder = () => {
        if (confirm('작성한 내용이 사라집니다. 진행하시겠습니까?')) {
            setSourceCodes((prev) => [...prev].reverse());
            setCodeDescriptions((prev) => [...prev].reverse());
            setCurrentCommentBlock(new CommentBlock());
        }
    };

    const handleRangeSelection = (
        side: DiffViewerSideType,
        range: number[],
        code: string
    ) => {
        setCurrentCommentBlock({
            ...currentCommentBlock,
            [side === DiffViewerSide.LEFT ? 'oldCode' : 'newCode']: code,
        });
    };

    const localSave = () => {
        const reviewMarkDownContent: ReviewMarkdownContent = {
            oldCode: sourceCodes[0].code as string,
            newCode: sourceCodes[1].code as string,
            commentBlocks: commentBlocks,
            comment: comment,
        };

        console.log(reviewMarkDownContent);
        chrome.runtime.sendMessage({
            action: 'saveRepository',
            content: markdownReview(reviewMarkDownContent),
        });
    };

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
                        <div className='review-note'>
                            <ReviewOverallCommentBlock />
                            <ReviewWriteBlock
                                commentBlock={currentCommentBlock}
                                setCommentBlock={setCurrentCommentBlock}
                                onRegistReviewBlock={(commentBlock) => {
                                    addCommentBlock(commentBlock);
                                    setCurrentCommentBlock(new CommentBlock());
                                }}
                            />
                            <ReviewNotes
                                commentBlocks={commentBlocks}
                                onDelete={deleteCommentBlock}
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
                        onClick={localSave}
                    />
                </div>
            }
            modalOpen={props.modalOpen}
            onClose={props.onClose}
        />
    );
};

export default ReviewNoteModal;
