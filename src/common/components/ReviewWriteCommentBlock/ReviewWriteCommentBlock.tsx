import React, { useState } from 'react';
import './ReviewWriteCommentBlock.css';

type ReviewWriteCommentBlockProps = {
    icon?: string;
    comment: string;
    onChangeComment: (comment: string) => void;
};

const ReviewWriteCommentBlock: React.FC<ReviewWriteCommentBlockProps> = (
    props: ReviewWriteCommentBlockProps
) => {
    const [rows, setRows] = useState(getOptimalRows());
    const resize = (comment: string) => {
        setRows(Math.max(getOptimalRows(), comment.split('\n').length));
    };

    function getOptimalRows() {
        return props.comment.split('\n').length;
    }

    return (
        <div className='review-write-comment-block'>
            <div className='review-write-comment-block__header'>
                <label>{props.icon}</label>
                <p>코멘트</p>
            </div>
            <textarea
                rows={rows}
                onChange={(event) => {
                    props.onChangeComment(event.target.value);
                    resize(event.target.value);
                }}
                spellCheck='false'
                defaultValue={props.comment}
            ></textarea>
        </div>
    );
};

export default ReviewWriteCommentBlock;
