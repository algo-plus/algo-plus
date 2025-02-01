import React, { useEffect, useRef, useState } from 'react';
import './ReviewNoteModal.css';
import { Modal } from '@/common/presentations/Modal';
import {
    CommentBlock,
    DiffViewerSide,
    DiffViewerSideType,
    ReviewMarkdownContent,
    SourceCode,
} from '@/common/types/review-note';
import { CodeDiffViewer } from '@/common/presentations/CodeDiffViewer';
import { Button } from '@/common/components/Button';
import { ReviewNotes } from '@/common/presentations/ReviewNotes';
import ReviewOverallCommentBlock, {
    ReviewOverallCommentBlockRef,
} from '@/common/presentations/ReviewOverallCommentBlock/ReviewOverallCommentBlock';
import { markdownReview } from '@/common/utils/review';
import { getObjectFromLocalStorage } from '@/common/utils/storage';
import { startLoader } from '@/baekjoon/utils/baekjoon';
import { Spinner } from '@/common/components/Spinner';
import { OverlayNotification } from '@/common/components/OverlayNotification';
import { ReviewWriteBlockWrapper } from '@/common/containers/ReviewWriteBlockWrapper';

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
    const reviewOverallCommentBlockRef =
        useRef<ReviewOverallCommentBlockRef>(null);

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
            setCommentBlocks([]);
            if (reviewOverallCommentBlockRef.current) {
                reviewOverallCommentBlockRef.current.setValue('');
            }
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

    const getMarkdownContent = (): string => {
        const reviewNoteContent: ReviewMarkdownContent = {
            oldCode: sourceCodes[0].code as string,
            newCode: sourceCodes[1].code as string,
            commentBlocks: commentBlocks,
            comment: reviewOverallCommentBlockRef.current?.getValue(),
        };
        return markdownReview(reviewNoteContent);
    };

    const localSave = () => {
        chrome.runtime.sendMessage({
            action: 'saveRepository',
            content: getMarkdownContent(),
        });
    };

    const uploadToGithub = async () => {
        const enable = await getObjectFromLocalStorage('alpEnable');
        if (!enable) {
            alert('깃허브 업로드를 위해서는 깃허브 연결이 필요합니다.');
            return enable;
        }
        startLoader(getMarkdownContent(), () => {});
    };

    return (
        <>
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
                                <ReviewOverallCommentBlock
                                    ref={reviewOverallCommentBlockRef}
                                />
                                <ReviewWriteBlockWrapper
                                    commentBlock={currentCommentBlock}
                                    setCommentBlock={setCurrentCommentBlock}
                                    onRegistReviewBlock={(commentBlock) => {
                                        addCommentBlock(commentBlock);
                                        setCurrentCommentBlock(
                                            new CommentBlock()
                                        );
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
                            onClick={uploadToGithub}
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
            <Spinner id='review-note-upload-spinner' show={false} />
            <OverlayNotification
                id='review-note-success-notification'
                show={false}
                message='업로드가 성공적으로 완료되었습니다!'
            />
        </>
    );
};

export default ReviewNoteModal;
