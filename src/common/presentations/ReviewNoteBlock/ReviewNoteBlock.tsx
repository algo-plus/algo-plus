import React, { useState } from 'react';
import './ReviewNoteBlock.css';
import { CommentBlock } from '@/common/types/review-note';
import { ReviewWriteCodeBlock } from '@/common/components/ReviewWriteCodeBlock';
import { ReviewWriteCommentBlock } from '@/common/components/ReviewWriteCommentBlock';
import { Button } from '@/common/components/Button';

type ReviewNoteBlockProps = {
    commentBlock: CommentBlock;
    onUpdate: () => void;
    onDelete: () => void;
};

const ReviewNoteBlock: React.FC<ReviewNoteBlockProps> = ({
    commentBlock,
    onUpdate,
    onDelete,
}: ReviewNoteBlockProps) => {
    const [readonly, setReadonly] = useState<boolean>(true);
    const [oldCodeName, setOldCodeName] = useState<string>(
        commentBlock.oldCodeName
    );
    const [newCodeName, setNewCodeName] = useState<string>(
        commentBlock.newCodeName
    );
    const [comment, setComment] = useState<string>(commentBlock.comment);

    const onBlockDelete = () => {
        if (confirm('블록을 삭제하시겠습니까?')) {
            onDelete();
        }
    };

    return (
        <div className={`review-note-block ${readonly ? 'readonly' : ''}`}>
            {commentBlock.oldCode ? (
                <ReviewWriteCodeBlock
                    icon='✏️'
                    codeName={oldCodeName}
                    code={commentBlock.oldCode}
                    onChangeCodeName={(codeName) => setOldCodeName(codeName)}
                    readonly={readonly}
                />
            ) : (
                <></>
            )}
            {commentBlock.newCode ? (
                <ReviewWriteCodeBlock
                    icon='🖊️'
                    codeName={newCodeName}
                    code={commentBlock.newCode}
                    onChangeCodeName={(codeName) => setNewCodeName(codeName)}
                    readonly={readonly}
                />
            ) : (
                <></>
            )}
            {commentBlock.oldCode || commentBlock.newCode ? (
                <>
                    <ReviewWriteCommentBlock
                        icon='📝'
                        comment={comment}
                        onChangeComment={(comment) => setComment(comment)}
                        readonly={readonly}
                    />
                    <div className='button-container'>
                        <Button
                            text={readonly ? '수정' : '수정 완료'}
                            onClick={() => {
                                setReadonly(!readonly);
                            }}
                            style={{ width: '100%' }}
                        ></Button>
                        <Button
                            text='삭제'
                            onClick={onBlockDelete}
                            style={{ width: '100%' }}
                        ></Button>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default ReviewNoteBlock;
