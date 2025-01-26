import React from 'react';
import './ReviewNoteModal.css';
import { Modal } from '@/common/presentations/Modal';
import { SourceCode } from '@/common/types/source';
import { CodeDiffViewer } from '@/common/presentations/CodeDiffViewer';
import { Button } from '@/common/components/Button';

type ReviewNoteModalProps = {
    modalOpen: boolean;
    onClose: () => void;
    codeDescriptions: string[];
    sourceCodes: SourceCode[];
};

const ReviewNoteModal: React.FC<ReviewNoteModalProps> = ({
    modalOpen,
    onClose,
    codeDescriptions,
    sourceCodes,
}: ReviewNoteModalProps) => {
    const buttonCommonStyle: React.CSSProperties = {
        width: '100px',
    };
    return (
        <Modal
            title={<h1 style={{ textAlign: 'center' }}>오답노트 작성</h1>}
            content={
                <>
                    <div className='algoplus-review-note-content'>
                        <p className='code-description'>
                            <span>{codeDescriptions[0]}</span>
                            <span>{codeDescriptions[1]}</span>
                        </p>
                        <CodeDiffViewer sourceCodes={sourceCodes} />
                    </div>
                </>
            }
            footer={
                <div className='algoplus-review-note-button-box'>
                    <Button
                        style={{ ...buttonCommonStyle }}
                        text='깃허브 업로드'
                        onClick={() => {}}
                    />
                    <Button
                        style={{ ...buttonCommonStyle }}
                        text='로컬 저장'
                        onClick={() => {}}
                    />
                </div>
            }
            modalOpen={modalOpen}
            onClose={onClose}
        />
    );
};

export default ReviewNoteModal;
