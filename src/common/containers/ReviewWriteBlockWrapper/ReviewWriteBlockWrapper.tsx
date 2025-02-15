import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ReviewWriteBlockWrapper.css';
import { DraggableResizableBox } from '@/common/components/DraggableResizableBox';
import { ReviewWriteBlock } from '@/common/presentations/ReviewWriteBlock';
import { ReviewWriteBlockProps } from '@/common/presentations/ReviewWriteBlock/ReviewWriteBlock';
import { ExternalButton } from '@/common/components/ExternalButton';
import { EmbedButton } from '@/common/components/EmbedButton';
import {
    BlockGeometry,
    loadWriteBlockGeometryFromStorage,
    saveWriteBlockGeometryToStorage,
    saveWriteBlockModeToStorage,
    getStoredWriteBlockModeIsExternal,
} from '@/common/utils/storage/review-note';

type ReviewWriteBlockWrapperProps = ReviewWriteBlockProps;

const MemoizedReviewWriteBlock = React.memo(ReviewWriteBlock);

const ReviewWriteBlockWrapper: React.FC<ReviewWriteBlockWrapperProps> = ({
    commentBlock,
    setCommentBlock,
    onRegistReviewBlock,
}: ReviewWriteBlockWrapperProps) => {
    const DEFAULT_BLOCK_GEOMETRY: BlockGeometry = {
        x: 0,
        y: -300,
        width: 650,
        height: 300,
    };
    const [isExternalMode, setIsExternalMode] = useState<boolean>(true);
    const [isGeometryLoaded, setIsGeometryLoaded] = useState(false);
    const [blockGeometry, setBlockGeometry] = useState<BlockGeometry>();
    const blockRef = useRef<HTMLDivElement>(null);

    const memoizedContent = useMemo(
        () => (props: { className?: string; modeButton: JSX.Element }) =>
            (
                <div ref={blockRef}>
                    <MemoizedReviewWriteBlock
                        className={props.className}
                        commentBlock={commentBlock}
                        setCommentBlock={setCommentBlock}
                        onRegistReviewBlock={onRegistReviewBlock}
                        headerCustomElement={props.modeButton}
                    />
                </div>
            ),
        [commentBlock, setCommentBlock, onRegistReviewBlock]
    );

    useEffect(() => {
        if (!isExternalMode) {
            setTimeout(() => {
                blockRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 0);
        }
    }, [isExternalMode]);

    const toggleWriteBlockMode = () => {
        const updatedMode = !isExternalMode;
        setIsExternalMode(updatedMode);
        saveWriteBlockModeToStorage(updatedMode);
    };

    const buttonCommonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '5px',
        right: '15px',
    };

    useEffect(() => {
        if (blockGeometry) {
            saveWriteBlockGeometryToStorage(blockGeometry);
        }
    }, [blockGeometry]);

    useEffect(() => {
        const syncBlockMode = async () => {
            const isExternalMode: boolean =
                await getStoredWriteBlockModeIsExternal();
            setIsExternalMode(isExternalMode);
        };
        const syncBlockGeometry = async () => {
            const storedBlockGeometry =
                await loadWriteBlockGeometryFromStorage();
            if (storedBlockGeometry) {
                setBlockGeometry(storedBlockGeometry);
            } else {
                setBlockGeometry(DEFAULT_BLOCK_GEOMETRY);
            }
            setIsGeometryLoaded(true);
        };
        syncBlockMode();
        syncBlockGeometry();
    }, []);

    return commentBlock.oldCode || commentBlock.newCode ? (
        <>
            {isExternalMode ? (
                <>
                    {isGeometryLoaded && blockGeometry && (
                        <DraggableResizableBox
                            defaultPosition={{
                                x: blockGeometry.x,
                                y: blockGeometry.y,
                            }}
                            defaultSize={{
                                width: blockGeometry.width,
                                height: blockGeometry.height,
                            }}
                            minWidth={400}
                            minHeight={200}
                            content={memoizedContent({
                                className: 'algoplus-block-draggable',
                                modeButton: (
                                    <EmbedButton
                                        onClick={toggleWriteBlockMode}
                                        style={buttonCommonStyle}
                                    />
                                ),
                            })}
                            onPositionChange={(x, y) =>
                                setBlockGeometry({ ...blockGeometry, x, y })
                            }
                            onSizeChange={(width, height) =>
                                setBlockGeometry({
                                    ...blockGeometry,
                                    width,
                                    height,
                                })
                            }
                        />
                    )}
                </>
            ) : (
                <>
                    <hr />
                    <div>
                        {memoizedContent({
                            className: 'algoplus-block',
                            modeButton: (
                                <ExternalButton
                                    onClick={toggleWriteBlockMode}
                                    style={buttonCommonStyle}
                                />
                            ),
                        })}
                    </div>
                </>
            )}
        </>
    ) : (
        <></>
    );
};

export default ReviewWriteBlockWrapper;
