import React from 'react';
import './ReviewNotes.css';
import { CommentBlock } from '@/common/types/source';
import { ReviewNoteBlock } from '@/common/presentations/ReviewNoteBlock';

type ReviewNotesProps = {
    commentBlocks: CommentBlock[];
    onDelete: (id: string) => void;
};

const ReviewNotes: React.FC<ReviewNotesProps> = ({
    commentBlocks,
    onDelete,
}: ReviewNotesProps) => {
    return (
        <>
            {commentBlocks.length > 0 ? (
                <>
                    <hr />
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
                        작성한 노트
                    </h2>
                    {commentBlocks.map((commentBlock, index) => (
                        <>
                            {index > 0 ? <hr /> : <></>}
                            <ReviewNoteBlock
                                key={commentBlock.id}
                                commentBlock={commentBlock}
                                onUpdate={() => {}}
                                onDelete={() => onDelete(commentBlock.id)}
                            />
                        </>
                    ))}
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default ReviewNotes;
