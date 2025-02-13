import React, { useState } from 'react';
import { Modal } from '@/baekjoon/presentations/Modal';
import './InfoModal.css';

interface InfoModalProps {
    modalOpen: boolean;
    onClose: () => void;
}

const InfoModal = ({ modalOpen, onClose }: InfoModalProps) => {
    /**
     * 새로운 디자인에 맞춰 업데이트 필요
     */
    const [step, setStep] = useState(0);
    const help1 = chrome.runtime.getURL('asset/help1.png');
    const help2 = chrome.runtime.getURL('asset/help2.png');
    const help3 = chrome.runtime.getURL('asset/help3.png');

    const modalContents = [
        {
            picture: help1,
            content: (
                <p>
                    코멘트를 달 코드 영역의 시작 인덱스와 끝 인덱스를
                    선택합니다.
                </p>
            ),
        },
        {
            picture: help2,
            content: (
                <p>
                    코드 영역은 최대 두 개까지 선택할 수 있습니다.
                    <br />
                    아래 코멘트를 단 후 등록 버튼을 눌러주세요.
                </p>
            ),
        },
        {
            picture: help3,
            content: (
                <p>
                    원하는 코멘트를 모두 작성했다면 저장 버튼을 눌러 깃허브
                    저장소에 저장하세요!
                    <br />
                    (깃허브 저장소가 등록되어 있어야 합니다.)
                </p>
            ),
        },
    ];

    const handleNext = () => {
        if (step < modalContents.length - 1) setStep(step + 1);
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    const contentWithNavigation = (
        <>
            <div className='contents'>
                <div className='picture-with-arrow'>
                    <button
                        className={`prev ${step === 0 ? 'hidden-arrow' : ''}`}
                        onClick={handlePrev}
                    >
                        &lt;
                    </button>
                    <img
                        className='fit-picture'
                        height={300}
                        src={modalContents[step].picture}
                    />
                    <button
                        className={`next ${
                            step === modalContents.length - 1
                                ? 'hidden-arrow'
                                : ''
                        }`}
                        onClick={handleNext}
                    >
                        &gt;
                    </button>
                </div>
                <div className='content-text'>
                    {modalContents[step].content}
                </div>
            </div>
        </>
    );

    const title = (
        <div className='title'>
            <h1>오답노트 작성 방법</h1>
        </div>
    );

    const footer = (
        <div className='step-indicator'>
            {modalContents.map((_, idx) => (
                <div
                    key={idx}
                    className={`circle ${step === idx ? 'active' : ''}`}
                ></div>
            ))}
        </div>
    );

    return (
        <div className='info-modal'>
            <Modal
                width='900px'
                height='600px'
                title={title}
                content={contentWithNavigation}
                footer={footer}
                modalOpen={modalOpen}
                onClose={onClose}
            />
        </div>
    );
};

export default InfoModal;
