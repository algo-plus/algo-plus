import React from 'react';
import './Modal.css';

const Modal = () => {
    const closeModal = () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    };
    const save = () => {
        console.log('save');
    };

    return (
        <div className='modal-backdrop' onClick={closeModal}>
            <div className='modal-content'>
                <div className='modal-header' style={{ display: 'flex' }}>
                    <h5 className='modal-title'>오답 노트 작성</h5>
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
                    <textarea rows={6} cols={50}></textarea>
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
        </div>
    );
};

export default Modal;
