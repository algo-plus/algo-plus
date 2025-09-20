import React, { useState, useRef, useEffect } from 'react';
import './HorizontalSplitView.css';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

type HorizontalSplitViewProps = {
    left: JSX.Element;
    right: JSX.Element;
    leftStyle?: React.CSSProperties;
    rightStyle?: React.CSSProperties;
    height?: string | number;
};

const HorizontalSplitView: React.FC<HorizontalSplitViewProps> = (
    props: HorizontalSplitViewProps
) => {
    const [panelsWidth, setPanelsWidth] = useState<number[]>([50, 50]);
    const [resizingIndex, setResizingIndex] = useState<number | null>(null);
    const [mouseOffset, setMouseOffset] = useState<number>(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (resizingIndex === null || !wrapperRef.current) return;

            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const totalWidth = wrapperRect.width;
            const mouseX = e.clientX - wrapperRect.left - mouseOffset;
            const leftPanelWidth = (mouseX / totalWidth) * 100;
            const rightPanelWidth = 100 - leftPanelWidth;

            const newWidths = [...panelsWidth];
            newWidths[resizingIndex] = leftPanelWidth;
            newWidths[resizingIndex + 1] = rightPanelWidth;
            setPanelsWidth(newWidths);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingIndex, panelsWidth]);

    const disableTextSelection = () => {
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
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
        const resizerMiddle = resizerRect.width / 2;
        const offset = e.clientX - resizerRect.left - resizerMiddle;
        setMouseOffset(offset);
        disableTextSelection();
        setResizingIndex(index);
    };

    return (
        <div
            className='horizontal split-view'
            ref={wrapperRef}
            style={{ height: props.height || '100%' }}
        >
            <div
                className='horizontal panel left'
                style={{
                    ...props.leftStyle,
                    width: `${panelsWidth[0]}%`,
                }}
            >
                {props.left}
            </div>
            <div
                className='horizontal resizer'
                onMouseDown={(e) => handleMouseDown(e, 0)}
            />
            <div
                className='horizontal panel right'
                style={{
                    ...props.rightStyle,
                    width: `${panelsWidth[1]}%`,
                }}
            >
                {props.right}
            </div>
        </div>
    );
};

export default HorizontalSplitView;
