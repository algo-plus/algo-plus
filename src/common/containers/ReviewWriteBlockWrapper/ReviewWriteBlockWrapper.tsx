import React, { useState } from 'react';
import './ReviewWriteBlockWrapper.css';
import { DraggableResizableBox } from '@/common/components/DraggableResizableBox';
import { ReviewWriteBlock } from '@/common/presentations/ReviewWriteBlock';
import { ReviewWriteBlockProps } from '@/common/presentations/ReviewWriteBlock/ReviewWriteBlock';

type ReviewWriteBlockWrapperProps = ReviewWriteBlockProps;

const ReviewWriteBlockWrapper: React.FC<ReviewWriteBlockWrapperProps> = ({
    commentBlock,
    setCommentBlock,
    onRegistReviewBlock,
}: ReviewWriteBlockWrapperProps) => {
    const [builtIn, setBuildIn] = useState<boolean>(true);

    return commentBlock.oldCode || commentBlock.newCode ? (
        <>
            {builtIn ? (
                <DraggableResizableBox
                    content={
                        <ReviewWriteBlock
                            className='algoplus-block-draggable'
                            commentBlock={commentBlock}
                            setCommentBlock={setCommentBlock}
                            onRegistReviewBlock={onRegistReviewBlock}
                        />
                    }
                />
            ) : (
                <>
                    <hr />
                    <ReviewWriteBlock
                        commentBlock={commentBlock}
                        setCommentBlock={setCommentBlock}
                        onRegistReviewBlock={onRegistReviewBlock}
                    />
                </>
            )}
            <button onClick={() => setBuildIn(!builtIn)}>빌트인</button>
        </>
    ) : (
        <></>
    );
};

export default ReviewWriteBlockWrapper;
