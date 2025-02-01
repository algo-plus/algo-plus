import React, { useEffect, useState } from 'react';
import './DraggableResizableBox.css';
import { Rnd } from 'react-rnd';

type DraggableResizableBoxProps = {
    content: JSX.Element;
    style?: React.CSSProperties;
    defaultSize?: { width: number; height: number };
    defaultPosition?: { x: number; y: number };
    minWidth?: number | string;
    minHeight?: number | string;
    onPositionChange?: (x: number, y: number) => void;
    onSizeChange?: (width: number, height: number) => void;
};

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({
    content,
    style,
    defaultSize = { width: 400, height: 300 },
    defaultPosition = { x: 0, y: 0 },
    minWidth = 400,
    minHeight = 300,
    onPositionChange,
    onSizeChange,
}) => {
    return (
        <Rnd
            default={{
                ...defaultPosition,
                ...defaultSize,
            }}
            minWidth={minWidth}
            minHeight={minHeight}
            bounds='body'
            style={{ ...style }}
            cancel='.no-drag'
            onResizeStop={(event, dir, ref, defaultCommands, position) => {
                onSizeChange && onSizeChange(ref.offsetWidth, ref.offsetHeight);
            }}
            onDragStop={(event, data) => {
                onPositionChange && onPositionChange(data.x, data.y);
            }}
        >
            {content}
        </Rnd>
    );
};

export default DraggableResizableBox;
