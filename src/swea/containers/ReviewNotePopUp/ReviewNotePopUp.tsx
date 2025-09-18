import React, { useCallback, useEffect, useState } from 'react';
import './ReviewNotePopUp.css';
import { PopUp } from '@/common/presentations/PopUp';
import { CodeSelectDescription } from '@/swea/components/CodeSelectDescription';
import { Button } from '@/common/components/Button';
import { isSameCode, parsingPopCodeParams } from '@/swea/apis/source';
import { SweaCodeMeta } from '@/swea/types/source';
import { CodeMetaContent } from '@/swea/components/CodeInfoContent';

type ReviewNotePopUpProps = {};

const ReviewNotePopUp: React.FC<ReviewNotePopUpProps> = ({}) => {
    const [reviewNoteModalOpen, setReviewNoteModalOpen] = useState(false);
    const [codeMetaList, setCodeMetaList] = useState<SweaCodeMeta[]>([]);

    const deleteCode = (codeMeta: SweaCodeMeta) => {
        setCodeMetaList((prevList) =>
            prevList.filter((meta) => !isSameCode(meta, codeMeta))
        );
    };

    const selectCode = (codeMeta: SweaCodeMeta) => {
        setCodeMetaList((prevList) => {
            const alreadySelected = prevList.some((meta) =>
                isSameCode(meta, codeMeta)
            );
            if (alreadySelected) {
                return prevList.filter((meta) => !isSameCode(meta, codeMeta));
            }
            if (prevList.length >= 2) {
                const el = codeMeta.checkboxElement as HTMLInputElement;
                el.checked = false;
                alert('코드는 최대 2개까지만 선택할 수 있습니다.');
                return prevList;
            }
            return [...prevList, codeMeta];
        });
    };

    const customLeftPanel = () => {
        const tableHeadRow = document.querySelector(
            'table.table_type3 thead tr'
        ) as HTMLTableRowElement;
        const tableSelectColumnHead = document.createElement('th');
        tableSelectColumnHead.scope = 'col';
        tableSelectColumnHead.innerText = '선택';
        tableHeadRow.insertBefore(
            tableSelectColumnHead,
            tableHeadRow.firstChild
        );

        document
            .querySelectorAll('table.table_type3 tbody tr')
            .forEach((row) => {
                const tableSelectColumn = document.createElement('td');

                const popCodeAnchor = row.querySelector(
                    'a.btn'
                ) as HTMLAnchorElement;
                const params = parsingPopCodeParams(
                    popCodeAnchor.getAttribute('onclick') as string
                );

                const submitTime =
                    document.querySelector('td[id^="submitTime"]')
                        ?.textContent ?? '-';
                const result =
                    document.querySelector('td:nth-child(3) span')
                        ?.textContent ?? 'ERROR!';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `problem-select-${params ? params[2] : ''}`;
                checkbox.classList.add('problem-select-checkbox');
                const codeMeta: SweaCodeMeta = {
                    contestProbId: params ? params[0] : '',
                    contestHistoryId: params ? params[1] : '',
                    submitIndex: params ? Number(params[2]) : -1,
                    checkboxElement: checkbox,
                    submitIndexLabel: `${params ? params[2] + '차' : '-'}`,
                    submitTime: submitTime,
                    result: result,
                };
                checkbox.addEventListener('change', (event: Event) => {
                    selectCode(codeMeta);
                });

                tableSelectColumn.appendChild(checkbox);
                row.insertBefore(tableSelectColumn, row.firstChild);
            });
    };

    useEffect(customLeftPanel, []);

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
                        <CodeSelectDescription />
                        {codeMetaList.length > 0 ? (
                            <>
                                {codeMetaList.map((codeMeta, index) => (
                                    <CodeMetaContent
                                        key={`${codeMeta.contestProbId}_${codeMeta.contestHistoryId}_${codeMeta.submitIndex}`}
                                        codeMeta={codeMeta}
                                        onClose={() => {
                                            deleteCode(codeMeta);
                                        }}
                                    />
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                        <Button text='오답노트 작성' onClick={() => {}} />
                    </div>
                }
            />
            {/* <ReviewNoteModal
                problemId={problemId}
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
            /> */}
        </>
    );
};

export default ReviewNotePopUp;
