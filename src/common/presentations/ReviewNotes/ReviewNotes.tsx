import React from 'react';
import './ReviewNotes.css';
import { CommentBlock } from '@/common/types/review-note';
import { ReviewNoteBlock } from '@/common/presentations/ReviewNoteBlock';

type ReviewNotesProps = {
    commentBlocks: CommentBlock[];
    onDelete: (id: string) => void;
    onUpdate: (id: string, comment: string) => void;
};

const ReviewNotes: React.FC<ReviewNotesProps> = ({
    commentBlocks,
    onDelete,
    onUpdate,
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
                        <React.Fragment key={commentBlock.id}>
                            {index > 0 && <hr />}
                            <ReviewNoteBlock
                                commentBlock={commentBlock}
                                onUpdate={(comment) => {
                                    onUpdate(commentBlock.id, comment);
                                }}
                                onDelete={() => onDelete(commentBlock.id)}
                            />
                        </React.Fragment>
                    ))}
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default ReviewNotes;
