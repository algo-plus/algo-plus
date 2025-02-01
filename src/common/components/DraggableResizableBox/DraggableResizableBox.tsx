import React, { useEffect, useState } from 'react';
import './DraggableResizableBox.css';
import { Rnd } from 'react-rnd';

type DraggableResizableBoxProps = {
    content: JSX.Element;
    style?: React.CSSProperties;
    defaultSize?: { width: number; height: number };
    minWidth?: number | string;
    minHeight?: number | string;
};

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({
    content,
    style,
    defaultSize = { width: 400, height: 300 },
    minWidth = 400,
    minHeight = 300,
}) => {
    return (
        <Rnd
            default={{
                x: 0,
                y: -defaultSize.height,
                ...defaultSize,
            }}
            minWidth={minWidth}
            minHeight={minHeight}
            bounds='body'
            style={{ ...style }}
            cancel='.no-drag'
        >
            {content}
        </Rnd>
    );
};

export default DraggableResizableBox;
