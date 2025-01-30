import React, { useMemo, useState } from 'react';
import './ReviewWriteBlockWrapper.css';
import { DraggableResizableBox } from '@/common/components/DraggableResizableBox';
import { ReviewWriteBlock } from '@/common/presentations/ReviewWriteBlock';
import { ReviewWriteBlockProps } from '@/common/presentations/ReviewWriteBlock/ReviewWriteBlock';
import { ExternalButton } from '@/common/components/ExternalButton';
import { EmbedButton } from '@/common/components/EmbedButton';

type ReviewWriteBlockWrapperProps = ReviewWriteBlockProps;

const MemoizedReviewWriteBlock = React.memo(ReviewWriteBlock);

const ReviewWriteBlockWrapper: React.FC<ReviewWriteBlockWrapperProps> = ({
    commentBlock,
    setCommentBlock,
    onRegistReviewBlock,
}: ReviewWriteBlockWrapperProps) => {
    const [externalMode, setExternalMode] = useState<boolean>(true);

    const memoizedContent = useMemo(
        () => (props: { className?: string; modeButton: JSX.Element }) =>
            (
                <>
                    <MemoizedReviewWriteBlock
                        className={props.className}
                        commentBlock={commentBlock}
                        setCommentBlock={setCommentBlock}
                        onRegistReviewBlock={onRegistReviewBlock}
                        headerCustomElement={props.modeButton}
                    />
                </>
            ),
        [commentBlock, setCommentBlock, onRegistReviewBlock]
    );

    const toggleWriteBlockMode = () => {
        setExternalMode(!externalMode);
    };

    const buttonCommonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '5px',
        right: '15px',
    };

    return commentBlock.oldCode || commentBlock.newCode ? (
        <>
            {externalMode ? (
                <>
                    <DraggableResizableBox
                        defaultSize={{ width: 600, height: 300 }}
                        minWidth={400}
                        minHeight={200}
                        content={memoizedContent({
                            className: 'algoplus-block-draggable',
                            modeButton: (
                                <EmbedButton
                                    onClick={toggleWriteBlockMode}
                                    style={buttonCommonStyle}
                                />
                            ),
                        })}
                    />
                </>
            ) : (
                <>
                    <hr />
                    <div>
                        {memoizedContent({
                            className: 'algoplus-block',
                            modeButton: (
                                <ExternalButton
                                    onClick={toggleWriteBlockMode}
                                    style={buttonCommonStyle}
                                />
                            ),
                        })}
                    </div>
                </>
            )}
        </>
    ) : (
        <></>
    );
};

export default ReviewWriteBlockWrapper;
