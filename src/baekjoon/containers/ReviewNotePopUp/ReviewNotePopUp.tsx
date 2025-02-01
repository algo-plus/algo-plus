import React, { useCallback, useEffect, useState } from 'react';
import './ReviewNotePopUp.css';
import { PopUp } from '@/common/presentations/PopUp';
import { CodeInfoContent } from '@/baekjoon/components/CodeInfoContent';
import { CodeNullContent } from '@/baekjoon/components/CodeNullContent';
import { fetchCode } from '@/baekjoon/apis/source';
import { Button } from '@/common/components/Button';
import { ReviewNoteModal } from '@/common/containers/ReviewNoteModal';
import { SourceCode } from '@/common/types/review-note';
import { CodeInfoNoteHeader } from '@/baekjoon/components/CodeInfoNoteHeader';
import { CodeInfo } from '@/baekjoon/types/review-note';
import {
    getCodeInfosFromStatusTable,
    getSubmissionElements,
} from '@/baekjoon/utils/parse';
import {
    loadCodeInfosFromStorage,
    loadSelectedCodeFromStorage,
    saveCodeInfosToStorage,
    saveSelectedCodeToStorage,
} from '@/baekjoon/utils/storage/review-note';

type ReviewNotePopUpProps = { problemId: string };

const ReviewNotePopUp: React.FC<ReviewNotePopUpProps> = ({ problemId }) => {
    const [submissionIds, setSubmissionIds] = useState<string[]>([]);
    const [codeInfos, setCodeInfos] = useState<CodeInfo[]>([]);
    const [sourceCodes, setSourceCodes] = useState<SourceCode[]>([]);
    const [reviewNoteModalOpen, setReviewNoteModalOpen] =
        useState<boolean>(false);
    const [storedCodeInfos, setStoredCodeInfos] = useState<CodeInfo[]>([]);

    const addSubmissionId = useCallback(
        (submissionId: string) => {
            setSubmissionIds((prev) => {
                if (prev.length >= 2) {
                    alert('코드는 최대 2개까지만 선택할 수 있습니다.');
                    return prev;
                }
                const updatedIds = [...prev, submissionId];
                saveSelectedCodeToStorage(problemId, updatedIds);
                return updatedIds;
            });
        },
        [problemId]
    );

    const deleteCode = useCallback(
        (submissionId: string) => {
            setSubmissionIds((prev) => {
                const updatedIds = prev.filter(
                    (_submissionId) => _submissionId !== submissionId
                );
                saveSelectedCodeToStorage(problemId, updatedIds);
                return updatedIds;
            });
        },
        [problemId]
    );

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

    const toggleReviewNoteModal = () => {
        setReviewNoteModalOpen(!reviewNoteModalOpen);
    };

    const getCodeInfo = (submissionId: string): CodeInfo | undefined => {
        return storedCodeInfos.find(
            (codeInfo) => codeInfo.submissionId === submissionId
        );
    };

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

        const sourceCodes = (await getSourceCodes()) as SourceCode[];
        setSourceCodes(sourceCodes);
        toggleReviewNoteModal();
    };

    useEffect(() => {
        const syncReviewNoteInfo = async () => {
            const codeInfos = getCodeInfosFromStatusTable();
            await saveCodeInfosToStorage(problemId, codeInfos);
            setStoredCodeInfos(await loadCodeInfosFromStorage(problemId));
            setSubmissionIds(await loadSelectedCodeFromStorage(problemId));
        };
        syncReviewNoteInfo();
    }, []);

    useEffect(() => {
        const updateCodeInfos = () => {
            const newCodeInfos = submissionIds.map((code) =>
                getCodeInfo(code)
            ) as CodeInfo[];
            setCodeInfos(newCodeInfos);
        };
        updateCodeInfos();
    }, [submissionIds]);

    useEffect(() => {
        const submissionIdElements = getSubmissionElements();
        const clickListeners = new Map();

        submissionIdElements.forEach((element) => {
            const submissionId = element.textContent?.trim();
            if (!submissionId) return;

            const listener = () => {
                const row = element.closest('tr');
                if (row instanceof HTMLElement) {
                    handleSubmissionClick(submissionId, row);
                }
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
    }, [handleSubmissionClick]);

    useEffect(() => {
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
    }, [submissionIds]);

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
                                        language={codeInfo.language}
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
                        <Button text='오답노트 작성' onClick={writeReview} />
                    </div>
                }
            />
            <ReviewNoteModal
                codeDescriptions={codeInfos.map((codeInfo, index) => (
                    <CodeInfoNoteHeader
                        key={codeInfo.submissionId}
                        submissionId={codeInfo.submissionId}
                        memory={codeInfo.memory}
                        time={codeInfo.time}
                        language={codeInfo.language}
                        result={codeInfo.result}
                    />
                ))}
                sourceCodes={sourceCodes}
                modalOpen={reviewNoteModalOpen}
                onClose={toggleReviewNoteModal}
            />
        </>
    );
};

export default ReviewNotePopUp;
