import React, { forwardRef, ForwardedRef } from 'react';
import AutoResizableTextarea, {
    AutoResizableTextareaRef,
} from '@/common/components/AutoResizableTextarea/AutoResizableTextarea';

type ReviewOverallCommentBlockProps = {};

export type ReviewOverallCommentBlockRef = AutoResizableTextareaRef;

const ReviewOverallCommentBlock = forwardRef<
    ReviewOverallCommentBlockRef,
    ReviewOverallCommentBlockProps
>((props, ref: ForwardedRef<ReviewOverallCommentBlockRef>) => {
    return (
        <>
            <hr />
            <h2 style={{ textAlign: 'center' }}>메모</h2>
            <AutoResizableTextarea
                defaultRow={4}
                placeholder='메모를 입력해주세요.'
                ref={ref}
            />
        </>
    );
});

export default ReviewOverallCommentBlock;
