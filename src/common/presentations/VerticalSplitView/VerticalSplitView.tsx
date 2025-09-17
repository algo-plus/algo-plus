import React, { useState, useRef, useEffect } from 'react';
import { CSSProperties } from 'react';
import './VerticalSplitView.css';

type VerticalSplitViewProps = {
    top: JSX.Element;
    bottom: JSX.Element;
    topStyle?: CSSProperties;
    bottomStyle?: CSSProperties;
};

const VerticalSplitView: React.FC<VerticalSplitViewProps> = (
    props: VerticalSplitViewProps
) => {
    const [panelsHeight, setPanelsHeight] = useState<number[]>([50, 50]);
    const [resizingIndex, setResizingIndex] = useState<number | null>(null);
    const [mouseOffset, setMouseOffset] = useState<number>(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (resizingIndex === null || !wrapperRef.current) return;

            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const totalHeight = wrapperRect.height;
            const mouseY = e.clientY - wrapperRect.top - mouseOffset;
            const topPanelHeight = (mouseY / totalHeight) * 100;
            const bottomPanelHeight = 100 - topPanelHeight;

            const newHeights = [...panelsHeight];
            newHeights[resizingIndex] = topPanelHeight;
            newHeights[resizingIndex + 1] = bottomPanelHeight;
            setPanelsHeight(newHeights);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingIndex, panelsHeight]);

    const disableTextSelection = () => {
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'row-resize';
    };

    const enableTextSelection = () => {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    const handleMouseUp = () => {
        enableTextSelection();
        setResizingIndex(null);
    };

    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    ) => {
        const resizerRect = e.currentTarget.getBoundingClientRect();
        const resizerMiddle = resizerRect.height / 2;
        const offset = e.clientY - resizerRect.top - resizerMiddle;
        setMouseOffset(offset);
        disableTextSelection();
        setResizingIndex(index);
    };

    return (
        <div className='vertical split-view' ref={wrapperRef}>
            <div
                className='vertical panel top'
                style={{
                    ...props.topStyle,
                    height: `${panelsHeight[0]}%`,
                }}
            >
                {props.top}
            </div>
            <div
                className='vertical resizer'
                onMouseDown={(e) => handleMouseDown(e, 0)}
            />
            <div
                className='vertical panel bottom'
                style={{
                    ...props.bottomStyle,
                    height: `${panelsHeight[1]}%`,
                    overflowY: 'scroll',
                }}
            >
                {props.bottom}
            </div>
        </div>
    );
};

export default VerticalSplitView;
