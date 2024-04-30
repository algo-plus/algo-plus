import React from 'react';
import './Modal.css';

type ModalProps = {
    width: string | number;
    height: string | number;
    title: string | JSX.Element;
    content: JSX.Element;
    footer: JSX.Element;
    modalOpen: boolean;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({
    width,
    height,
    title,
    content,
    footer,
    modalOpen,
    onClose,
}) => {
    return (
        <div
            className='boj-modal-background'
            style={modalOpen ? {} : { display: 'none' }}
        >
            <div
                className='boj-modal'
                style={{
                    width: width,
                    height: height,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '5px',
                }}
            >
                <div className='modal-header'>
                    <div className='modal-title' style={{ width: '100%' }}>
                        {title}
                    </div>
                    <button
                        type='button'
                        className='boj-modal-close'
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className='modal-body boj-modal-body'>{content}</div>
                <div className='modal-footer'>{footer}</div>
            </div>
        </div>
    );
};

export default Modal;
