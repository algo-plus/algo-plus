import React, { useState, useRef, useEffect } from 'react';
import { ProblemPanel } from '../ProblemPanel';
import { EditorPanel } from '../EditorPanel';

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

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingIndex, panelsWidth]);

    const disableTextSelection = () => {
        document.body.style.userSelect = 'none';
    };

    const enableTextSelection = () => {
        document.body.style.userSelect = '';
    };

    const handleMouseUp = () => {
        enableTextSelection();
        setResizingIndex(null);
    };

    const handleMouseDown = (index: number) => {
        disableTextSelection();
        setResizingIndex(index);
    };

    return (
        <div
            className='split-view'
            ref={wrapperRef}
            style={{ display: 'flex' }}
        >
            <div
                className='panel left'
                style={{
                    width: `${panelsWidth[0]}%`,
                    position: 'relative',
                    overflow: 'auto',
                }}
                onMouseDown={() => handleMouseDown(0)}
            >
                {props.left.type === 'Problem' ? (
                    <ProblemPanel problemId={props.left.data} />
                ) : props.left.type === 'Editor' ? (
                    <div>
                        <EditorPanel
                            csrfKey={props.right.data}
                            problemId={props.left.data}
                        />
                    </div>
                ) : (
                    <div>Panel 1</div>
                )}
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
                className='panel right'
                style={{
                    width: `${panelsWidth[1]}%`,
                    position: 'relative',
                    overflow: 'auto',
                }}
                onMouseDown={() => handleMouseDown(1)}
            >
                {props.right.type === 'Problem' ? (
                    <ProblemPanel problemId={props.left.data} />
                ) : props.right.type === 'Editor' ? (
                    <EditorPanel
                        csrfKey={props.right.data}
                        problemId={props.left.data}
                    />
                ) : (
                    <div>Panel 2</div>
                )}
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
