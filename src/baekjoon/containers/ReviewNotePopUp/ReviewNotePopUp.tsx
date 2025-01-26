import React, { useCallback, useEffect, useState } from 'react';
import './ReviewNotePopUp.css';
import { PopUp } from '@/common/presentations/PopUp';
import { CodeInfoContent } from '@/baekjoon/components/CodeInfoContent';
import { CodeNullContent } from '@/baekjoon/components/CodeNullContent';
import { fetchCode } from '@/baekjoon/apis/source';
import { ReviewModal } from '../ReviewModal';
import { CodeProps } from '@/baekjoon/types/source';

type ReviewNotePopUpProps = {};

const ReviewNotePopUp: React.FC<ReviewNotePopUpProps> = () => {
    const [submissionIds, setSubmissionIds] = useState<string[]>([]);
    const [codeInfos, setCodeInfos] = useState<CodeInfo[]>([]);
    const [sourceCodes, setSourceCodes] = useState<CodeProps[]>([]);
    const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

    const getSubmissionElements = useCallback(() => {
        return document.querySelectorAll(
            'table#status-table tbody tr td:first-child'
        ) as NodeListOf<HTMLTableCellElement>;
    }, []);

    const addSubmissionId = useCallback((submissionId: string) => {
        setSubmissionIds((prev) => {
            if (prev.length < 2) {
                return [...prev, submissionId];
            }
            alert('코드는 최대 2개까지만 선택할 수 있습니다.');
            return prev;
        });
    }, []);

    const deleteCode = useCallback((submissionId: string) => {
        setSubmissionIds((prev) =>
            prev.filter((_submissionId) => _submissionId !== submissionId)
        );
    }, []);

    const toggleReviewModal = () => {
        setReviewModalOpen(!reviewModalOpen);
    };

    const handleSubmissionClick = useCallback(
        (submissionId: string, row: HTMLElement) => {
            if (row.classList.contains('algoplus-code-select')) {
                deleteCode(submissionId);
            } else {
                addSubmissionId(submissionId);
            }
        },
        [addSubmissionId, deleteCode]
    );

    const updateCodeList = useCallback(() => {
        const submissionIdElements = getSubmissionElements();

        submissionIdElements.forEach((element) => {
            const submissionId = element.textContent?.trim();
            if (!submissionId) return;
            const row = element.closest('tr') as HTMLElement;
            row.classList.toggle(
                'algoplus-code-select',
                submissionIds.includes(submissionId)
            );
        });
    }, [submissionIds, getSubmissionElements]);

    const getCodeInfo = useCallback(
        (submissionId: string): CodeInfo | null => {
            const elements = getSubmissionElements();
            for (const element of elements) {
                if (element.textContent?.trim() === submissionId) {
                    const row = element.closest('tr') as HTMLElement;
                    const codeInfo: CodeInfo = {
                        submissionId: String(submissionId),
                        memory:
                            row.querySelector('.memory')?.textContent?.trim() ||
                            '',
                        time:
                            row.querySelector('.time')?.textContent?.trim() ||
                            '',
                        result:
                            row
                                .querySelector('.result-text')
                                ?.textContent?.trim() || '',
                    };
                    return codeInfo;
                }
            }
            return null;
        },
        [getSubmissionElements]
    );

    const getSourceCodes = async () => {
        const sourceCodes = [];
        for (const submissionId of submissionIds) {
            const sourceCode = await fetchCode(submissionId);
            sourceCodes.push(sourceCode);
        }
        return sourceCodes;
    };

    const writeReview = async () => {
        if (submissionIds.length === 0) {
            alert('오답노트를 작성할 코드를 선택해주세요.');
            return;
        }

        const sourceCodes = (await getSourceCodes()) as CodeProps[];
        setSourceCodes(sourceCodes);
        toggleReviewModal();
    };

    useEffect(() => {
        const updateCodeInfos = () => {
            const newCodeInfos = submissionIds.map((code) =>
                getCodeInfo(code)
            ) as CodeInfo[];
            setCodeInfos(newCodeInfos);
        };
        updateCodeInfos();
    }, [submissionIds, getCodeInfo]);

    useEffect(() => {
        const submissionIdElements = getSubmissionElements();
        const clickListeners = new Map();

        submissionIdElements.forEach((element) => {
            const submissionId = element.textContent?.trim();
            if (!submissionId) return;

            const listener = () => {
                const row = element.closest('tr') as HTMLElement;
                handleSubmissionClick(submissionId, row);
            };
            clickListeners.set(element, listener);
            element.addEventListener('click', listener);
        });

        return () => {
            submissionIdElements.forEach((element) => {
                const listener = clickListeners.get(element);
                if (listener) {
                    element.removeEventListener('click', listener);
                }
            });
        };
    }, [getSubmissionElements, handleSubmissionClick]);

    useEffect(() => {
        updateCodeList();
    }, [submissionIds, updateCodeList]);

    return (
        <>
            <PopUp
                style={{ right: '10px', bottom: '10px' }}
                content={
                    <div className='review-note-pop-up__content'>
                        <img
                            src='https://github.com/algo-plus/.github/assets/72266806/b525e405-0f3a-4434-911e-c5320ed64170'
                            alt='algoplus-logo'
                            height='45px'
                        />
                        <CodeNullContent />
                        {submissionIds.length > 0 ? (
                            <>
                                {codeInfos.map((codeInfo, index) => (
                                    <CodeInfoContent
                                        key={codeInfo.submissionId}
                                        submissionId={codeInfo.submissionId}
                                        memory={codeInfo.memory}
                                        time={codeInfo.time}
                                        result={codeInfo.result}
                                        onClose={() => {
                                            deleteCode(codeInfo.submissionId);
                                        }}
                                    />
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                        <button
                            className='review-note-pop-up__button'
                            onClick={writeReview}
                        >
                            오답노트 작성
                        </button>
                    </div>
                }
            />
            {reviewModalOpen ? (
                <ReviewModal sourceCodes={sourceCodes} />
            ) : (
                <></>
            )}
        </>
    );
};

export default ReviewNotePopUp;
