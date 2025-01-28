import React, { Dispatch, Ref, RefObject, SetStateAction } from 'react';
import AutoResizableTextarea from '@/common/components/AutoResizableTextarea/AutoResizableTextarea';

type ReviewOverallCommentBlockProps = {
    commentRef: RefObject<HTMLTextAreaElement>;
};

const ReviewOverallCommentBlock: React.FC<ReviewOverallCommentBlockProps> = ({
    commentRef,
}: ReviewOverallCommentBlockProps) => {
    return (
        <>
            <hr />
            <h2 style={{ textAlign: 'center' }}>메모</h2>
            <AutoResizableTextarea
                defaultRow={4}
                onChange={() => {}}
                placeholder='메모를 입력해주세요.'
                ref={commentRef}
            />
        </>
    );
};

export default ReviewOverallCommentBlock;
