import React, { useState } from 'react';
import AutoResizableTextarea from '@/common/components/AutoResizableTextarea/AutoResizableTextarea';

type ReviewOverallCommentBlockProps = {};

const ReviewOverallCommentBlock: React.FC<
    ReviewOverallCommentBlockProps
> = ({}: ReviewOverallCommentBlockProps) => {
    const [comment, setComment] = useState<string>('');

    return (
        <>
            <hr />
            <h2 style={{ textAlign: 'center' }}>메모</h2>
            <AutoResizableTextarea
                defaultRow={4}
                onChange={(event) => setComment(event.target.value)}
                placeholder='메모를 입력해주세요.'
            />
        </>
    );
};

export default ReviewOverallCommentBlock;
