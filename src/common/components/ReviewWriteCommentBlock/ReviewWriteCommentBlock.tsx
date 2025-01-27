import React, { useState } from 'react';
import './ReviewWriteCommentBlock.css';
import AutoResizableTextarea from '../AutoResizableTextarea/AutoResizableTextarea';

type ReviewWriteCommentBlockProps = {
    icon?: string;
    comment: string;
    onChangeComment: (comment: string) => void;
    readonly?: boolean;
};

const ReviewWriteCommentBlock: React.FC<ReviewWriteCommentBlockProps> = (
    props: ReviewWriteCommentBlockProps
) => {
    return (
        <div
            className={`review-write-comment-block ${
                props.readonly ? 'readonly' : ''
            }`}
        >
            <div className='review-write-comment-block__header'>
                <label>{props.icon}</label>
                <p>코멘트</p>
            </div>
            <AutoResizableTextarea
                onChange={(event) => props.onChangeComment(event.target.value)}
                defaultValue={props.comment}
                disabled={props.readonly}
            />
        </div>
    );
};

export default ReviewWriteCommentBlock;
