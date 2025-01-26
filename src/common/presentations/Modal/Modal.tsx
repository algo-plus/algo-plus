import React from 'react';
import './Modal.css';

type ModalProps = {
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    title?: string | JSX.Element;
    content: JSX.Element;
    footer?: JSX.Element;
    modalOpen: boolean;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({
    width,
    height,
    style,
    title,
    content,
    footer,
    modalOpen,
    onClose,
}) => {
    return (
        <div
            className='algoplus-modal-background'
            style={{
                ...style,
                ...(modalOpen ? {} : { display: 'none' }),
            }}
        >
            <div
                className='algoplus-modal'
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
                        className='algoplus-modal-close'
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className='modal-body algoplus-modal-body'>{content}</div>
                <div className='modal-footer'>{footer}</div>
            </div>
        </div>
    );
};

export default Modal;
