import React from 'react';
import './ReviewNotes.css';
import { CodeBlock } from '@/common/types/source';
import { ReviewWriteBlock } from '../ReviewWriteBlock';
import { ReviewNoteBlock } from '../ReviewNoteBlock';

type ReviewNotesProps = {
    codeBlocks: CodeBlock[];
    onDelete: (id: string) => void;
};

const ReviewNotes: React.FC<ReviewNotesProps> = ({
    codeBlocks,
    onDelete,
}: ReviewNotesProps) => {
    return (
        <>
            {codeBlocks.length > 0 ? (
                <>
                    <hr />
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
                        작성한 노트
                    </h2>
                    {codeBlocks.map((codeBlock, index) => (
                        <>
                            {index > 0 ? <hr /> : <></>}
                            <ReviewNoteBlock
                                key={codeBlock.id}
                                codeBlock={codeBlock}
                                onUpdate={() => {}}
                                onDelete={() => onDelete(codeBlock.id)}
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
