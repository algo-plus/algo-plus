import React from 'react';
import './ReviewNotes.css';
import { CodeBlock } from '@/common/types/source';
import { ReviewWriteBlock } from '../ReviewWriteBlock';
import { ReviewNoteBlock } from '../ReviewNoteBlock';

type ReviewNotesProps = {
    codeBlocks: CodeBlock[];
};

const ReviewNotes: React.FC<ReviewNotesProps> = ({
    codeBlocks,
}: ReviewNotesProps) => {
    return (
        <>
            {codeBlocks.map((codeBlock, index) => (
                <>
                    <hr />
                    <ReviewNoteBlock
                        key={index}
                        codeBlock={codeBlock}
                        onUpdate={() => {}}
                        onDelete={() => {}}
                    />
                </>
            ))}
        </>
    );
};

export default ReviewNotes;
