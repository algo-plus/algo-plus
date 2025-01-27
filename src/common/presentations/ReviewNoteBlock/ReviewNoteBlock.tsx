import React, { useState } from 'react';
import './ReviewNoteBlock.css';
import { CodeBlock } from '@/common/types/source';
import { ReviewWriteCodeBlock } from '@/common/components/ReviewWriteCodeBlock';
import { ReviewWriteCommentBlock } from '@/common/components/ReviewWriteCommentBlock';
import { Button } from '@/common/components/Button';

type ReviewNoteBlockProps = {
    codeBlock: CodeBlock;
    onUpdate: () => void;
    onDelete: () => void;
};

const ReviewNoteBlock: React.FC<ReviewNoteBlockProps> = ({
    codeBlock,
    onUpdate,
    onDelete,
}: ReviewNoteBlockProps) => {
    const [readonly, setReadonly] = useState<boolean>(true);
    const [oldCodeName, setOldCodeName] = useState<string>(
        codeBlock.oldCodeName
    );
    const [newCodeName, setNewCodeName] = useState<string>(
        codeBlock.newCodeName
    );
    const [comment, setComment] = useState<string>(codeBlock.comment);

    return (
        <div className={`review-note-block ${readonly ? 'readonly' : ''}`}>
            <ReviewWriteCodeBlock
                icon='✏️'
                codeName={oldCodeName}
                code={codeBlock.oldCode}
                onChangeCodeName={(codeName) => setOldCodeName(codeName)}
                readonly={readonly}
            />
            <ReviewWriteCodeBlock
                icon='🖊️'
                codeName={newCodeName}
                code={codeBlock.newCode}
                onChangeCodeName={(codeName) => setNewCodeName(codeName)}
                readonly={readonly}
            />
            {codeBlock.oldCode || codeBlock.newCode ? (
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
                            onClick={onDelete}
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
