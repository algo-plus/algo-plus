import React, { useMemo, useState } from 'react';
import './ReviewWriteBlockWrapper.css';
import { DraggableResizableBox } from '@/common/components/DraggableResizableBox';
import { ReviewWriteBlock } from '@/common/presentations/ReviewWriteBlock';
import { ReviewWriteBlockProps } from '@/common/presentations/ReviewWriteBlock/ReviewWriteBlock';

type ReviewWriteBlockWrapperProps = ReviewWriteBlockProps;

const MemoizedReviewWriteBlock = React.memo(ReviewWriteBlock);

const ReviewWriteBlockWrapper: React.FC<ReviewWriteBlockWrapperProps> = ({
    commentBlock,
    setCommentBlock,
    onRegistReviewBlock,
}: ReviewWriteBlockWrapperProps) => {
    const [builtIn, setBuildIn] = useState<boolean>(true);

    const memoizedContent = useMemo(
        () => (props: { className?: string }) =>
            (
                <MemoizedReviewWriteBlock
                    className={props.className}
                    commentBlock={commentBlock}
                    setCommentBlock={setCommentBlock}
                    onRegistReviewBlock={onRegistReviewBlock}
                />
            ),
        [commentBlock, setCommentBlock, onRegistReviewBlock]
    );

    return commentBlock.oldCode || commentBlock.newCode ? (
        <>
            {builtIn ? (
                <DraggableResizableBox
                    defaultSize={{ width: 500, height: 300 }}
                    minWidth={400}
                    minHeight={200}
                    content={memoizedContent({
                        className: 'algoplus-block-draggable',
                    })}
                />
            ) : (
                <>
                    <hr />
                    {memoizedContent({})}
                </>
            )}
            <button onClick={() => setBuildIn(!builtIn)}>빌트인</button>
        </>
    ) : (
        <></>
    );
};

export default ReviewWriteBlockWrapper;
