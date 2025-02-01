import React, { useEffect, useMemo, useState } from 'react';
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
    const [externalMode, setExternalMode] = useState<boolean>(true);
    const [isGeometryLoaded, setIsGeometryLoaded] = useState(false);
    const [blockGeometry, setBlockGeometry] = useState<BlockGeometry>();

    const memoizedContent = useMemo(
        () => (props: { className?: string; modeButton: JSX.Element }) =>
            (
                <>
                    <MemoizedReviewWriteBlock
                        className={props.className}
                        commentBlock={commentBlock}
                        setCommentBlock={setCommentBlock}
                        onRegistReviewBlock={onRegistReviewBlock}
                        headerCustomElement={props.modeButton}
                    />
                </>
            ),
        [commentBlock, setCommentBlock, onRegistReviewBlock]
    );

    const toggleWriteBlockMode = () => {
        setExternalMode(!externalMode);
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
        syncBlockGeometry();
    }, []);

    return commentBlock.oldCode || commentBlock.newCode ? (
        <>
            {externalMode ? (
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
