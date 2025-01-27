import React, { useEffect, useState } from 'react';
import './ReviewWriteBlock.css';
import { CodeBlock } from '@/common/types/source';
import ReviewWriteCodeBlock from '@/common/components/ReviewWriteCodeBlock/ReviewWriteCodeBlock';
import { ReviewWriteCommentBlock } from '@/common/components/ReviewWriteCommentBlock';
import { Button } from '@/common/components/Button';

type ReviewWriteBlockProps = {
    codeBlock: CodeBlock;
    setCodeBlock: (codeBlock: CodeBlock) => void;
    onRegistReviewBlock: (codeBlock: CodeBlock) => void;
};

const ReviewWriteBlock: React.FC<ReviewWriteBlockProps> = ({
    codeBlock,
    setCodeBlock,
    onRegistReviewBlock,
}: ReviewWriteBlockProps) => {
    const [oldCodeName, setOldCodeName] = useState<string>(
        codeBlock.oldCodeName
    );
    const [oldCode, setOldCode] = useState<string>(codeBlock.oldCode);
    const [newCodeName, setNewCodeName] = useState<string>(
        codeBlock.newCodeName
    );
    const [newCode, setNewCode] = useState<string>(codeBlock.newCode);
    const [comment, setComment] = useState<string>('');

    useEffect(() => {
        setOldCode(codeBlock.oldCode);
        setNewCode(codeBlock.newCode);
    }, [codeBlock]);

    const registReviewBlock = () => {
        const registered: CodeBlock = {
            ...codeBlock,
            oldCodeName: oldCodeName,
            newCodeName: newCodeName,
            comment: comment,
        };
        setComment('');
        setCodeBlock(registered);
        onRegistReviewBlock(registered);
    };

    return (
        <>
            {oldCode || newCode ? (
                <>
                    <hr />
                    <div className='review-note-write-container'>
                        <ReviewWriteCodeBlock
                            icon='✏️'
                            codeName={oldCodeName}
                            code={oldCode}
                            onChangeCodeName={(codeName) =>
                                setOldCodeName(codeName)
                            }
                        />
                        <ReviewWriteCodeBlock
                            icon='🖊️'
                            codeName={newCodeName}
                            code={newCode}
                            onChangeCodeName={(codeName) =>
                                setNewCodeName(codeName)
                            }
                        />
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
                                        style={{ width: '100%' }}
                                    ></Button>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default ReviewWriteBlock;
