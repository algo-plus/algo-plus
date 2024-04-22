import React, { useState, useRef, useEffect } from 'react';
import { ProblemPanel } from '../Panel';

const SplitView: React.FC<PanelProps> = (props: PanelProps) => {
    const [panelsWidth, setPanelsWidth] = useState<number[]>([50, 50]);
    const [resizingIndex, setResizingIndex] = useState<number | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (resizingIndex === null || !wrapperRef.current) return;

            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const totalWidth = wrapperRect.width;
            const mouseX = e.clientX;
            const leftPanelWidth = (mouseX / totalWidth) * 100;
            const rightPanelWidth = 100 - leftPanelWidth;

            const newWidths = [...panelsWidth];
            newWidths[resizingIndex] = leftPanelWidth;
            newWidths[resizingIndex + 1] = rightPanelWidth;
            setPanelsWidth(newWidths);
        };

        const handleMouseUp = () => {
            setResizingIndex(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingIndex, panelsWidth]);

    const handleMouseDown = (index: number) => {
        setResizingIndex(index);
    };

    return (
        <div
            className='split-view'
            ref={wrapperRef}
            style={{ display: 'flex' }}
        >
            <div
                className='panel'
                style={{
                    width: `${panelsWidth[0]}%`,
                    position: 'relative',
                    overflow: 'auto',
                }}
                onMouseDown={() => handleMouseDown(0)}
            >
                <ProblemPanel problemId={props.left.data} />
            </div>
            <div
                className='resizer'
                style={{
                    width: '5px',
                    cursor: 'col-resize',
                    position: 'relative',
                    backgroundColor: '#eee',
                }}
                onMouseDown={() => handleMouseDown(0)}
            />
            <div
                className='panel'
                style={{
                    width: `${panelsWidth[1]}%`,
                    position: 'relative',
                    overflow: 'auto',
                }}
                onMouseDown={() => handleMouseDown(1)}
            >
                Panel 2
            </div>
        </div>
    );
};

export default SplitView;
type PanelProps = {
    left: {
        type: string;
        data?: any;
    };
    right: {
        type: string;
        data?: any;
    };
};
