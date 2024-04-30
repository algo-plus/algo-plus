import { Modal } from '@/baekjoon/presentations/Modal';
import React, { useState } from 'react';
import './WrongResultModal.css';
import { refreshUrl } from '@/common/utils/url';

type WrongResultModalProps = {
    problemId: string | number;
    message?: string | null;
};

const WrongResultModal: React.FC<WrongResultModalProps> = ({
    problemId,
    message,
}) => {
    const [modalOpen, setModalOpen] = useState<boolean>(true);

    return (
        <Modal
            width={350}
            height={250}
            title={
                <h2
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}
                >
                    틀렸습니다!
                </h2>
            }
            content={
                <div className='content-center'>
                    <h4>{message}</h4>
                </div>
            }
            footer={
                <div className='content-center'>
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                            refreshUrl(
                                `https://www.acmicpc.net/submit/${problemId}?solve=true`
                            );
                        }}
                    >
                        문제로 돌아가기
                    </button>
                </div>
            }
            modalOpen={modalOpen}
            onClose={() => setModalOpen(false)}
        />
    );
};

export default WrongResultModal;
