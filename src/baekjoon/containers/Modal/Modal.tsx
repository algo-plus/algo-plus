import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import './Modal.css';
import { ModalProps } from '@/baekjoon/types/source';

const Modal = (ModalProps: ModalProps) => {
    const closeModal = () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        console.log('close modal');
    };
    const save = () => {
        console.log('save');
    };

    const oldCode = ModalProps.sourceCodes[0];
    const newCode = ModalProps.sourceCodes[1];

    return (
        <div className='modal-content'>
            <div className='modal-header' style={{ display: 'flex' }}>
                <h4 className='modal-title'>오답 노트 작성</h4>
                <button
                    type='button'
                    className='close'
                    data-dismiss='modal'
                    aria-label='Close'
                    onClick={closeModal}
                >
                    <span aria-hidden='true'>&times;</span>
                </button>
            </div>
            <div className='modal-body'>
                <div className='codediff-container'>
                    <h5>코드 비교 결과:</h5>
                    <ReactDiffViewer
                        oldValue={oldCode ? oldCode : ''}
                        newValue={newCode ? newCode : ''}
                        compareMethod={DiffMethod.LINES}
                        splitView={true}
                    />
                </div>
                <div>
                    <h5>전체 코멘트</h5>
                    <textarea rows={4} cols={50}></textarea>
                </div>
            </div>
            <div className='modal-footer'>
                <button
                    type='button'
                    className='btn btn-secondary'
                    data-dismiss='modal'
                    onClick={closeModal}
                >
                    취소
                </button>
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={save}
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default Modal;
