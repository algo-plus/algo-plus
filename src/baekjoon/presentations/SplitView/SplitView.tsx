import React, { useState, useRef, useEffect } from 'react';
import './SplitView.css';

type SplitViewProps = {
    left: JSX.Element;
    right: JSX.Element;
};

const SplitView: React.FC<SplitViewProps> = (props: SplitViewProps) => {
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
        const offset = e.clientX - resizerRect.left;
        setMouseOffset(offset);
        disableTextSelection();
        setResizingIndex(index);
    };

    return (
        <div className='split-view' ref={wrapperRef}>
            <div
                className='panel left'
                style={{
                    width: `${panelsWidth[0]}%`,
                }}
            >
                {props.left}
            </div>
            <div
                className='resizer'
                onMouseDown={(e) => handleMouseDown(e, 0)}
            />
            <div
                className='panel right'
                style={{
                    width: `${panelsWidth[1]}%`,
                }}
            >
                {props.right}
            </div>
        </div>
    );
};

export default SplitView;
