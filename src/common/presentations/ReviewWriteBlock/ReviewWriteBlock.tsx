import React, { useEffect, useState } from 'react';
import './ReviewWriteBlock.css';
import { CommentBlock } from '@/common/types/review-note';
import ReviewWriteCodeBlock from '@/common/components/ReviewWriteCodeBlock/ReviewWriteCodeBlock';
import { ReviewWriteCommentBlock } from '@/common/components/ReviewWriteCommentBlock';
import { Button } from '@/common/components/Button';

export type ReviewWriteBlockProps = {
    commentBlock: CommentBlock;
    setCommentBlock: (commentBlock: CommentBlock) => void;
    onRegistReviewBlock: (commentBlock: CommentBlock) => void;
    className?: string;
};

const ReviewWriteBlock: React.FC<ReviewWriteBlockProps> = ({
    commentBlock,
    setCommentBlock,
    onRegistReviewBlock,
    className,
}: ReviewWriteBlockProps) => {
    const [oldCodeName, setOldCodeName] = useState<string>(
        commentBlock.oldCodeName
    );
    const [oldCode, setOldCode] = useState<string>(commentBlock.oldCode);
    const [newCodeName, setNewCodeName] = useState<string>(
        commentBlock.newCodeName
    );
    const [newCode, setNewCode] = useState<string>(commentBlock.newCode);
    const [comment, setComment] = useState<string>('');

    useEffect(() => {
        setOldCode(commentBlock.oldCode);
        setNewCode(commentBlock.newCode);
    }, [commentBlock]);

    const registReviewBlock = () => {
        const registered: CommentBlock = {
            ...commentBlock,
            oldCodeName: oldCodeName,
            newCodeName: newCodeName,
            comment: comment,
        };
        setComment('');
        setCommentBlock(registered);
        onRegistReviewBlock(registered);
    };

    return (
        <>
            <div className={`review-write-block ${className}`}>
                {/* <hr /> */}
                <h2
                    style={{
                        textAlign: 'center',
                        marginBottom: '10px',
                    }}
                >
                    노트 작성
                </h2>
                <div className='review-note-write-container'>
                    {oldCode ? (
                        <ReviewWriteCodeBlock
                            icon='✏️'
                            codeName={oldCodeName}
                            code={oldCode}
                            onChangeCodeName={(codeName) =>
                                setOldCodeName(codeName)
                            }
                        />
                    ) : (
                        <></>
                    )}
                    {newCode ? (
                        <ReviewWriteCodeBlock
                            icon='🖊️'
                            codeName={newCodeName}
                            code={newCode}
                            onChangeCodeName={(codeName) =>
                                setNewCodeName(codeName)
                            }
                        />
                    ) : (
                        <></>
                    )}
                    {oldCode || newCode ? (
                        <>
                            <ReviewWriteCommentBlock
                                icon='📝'
                                comment={comment}
                                onChangeComment={(comment) =>
                                    setComment(comment)
                                }
                            />
                            <div className='button-container'>
                                <Button
                                    text='등록'
                                    onClick={registReviewBlock}
                                    style={{
                                        width: '100%',
                                    }}
                                ></Button>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
};

export default ReviewWriteBlock;
