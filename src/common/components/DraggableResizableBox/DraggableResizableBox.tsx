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
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const calculateCenterPosition = () => {
        const x = Math.max(0, (window.innerWidth - defaultSize.width) / 2);
        const y = Math.max(0, (window.innerHeight - defaultSize.height) / 2);
        setPosition({ x, y });
    };

    useEffect(() => {
        calculateCenterPosition();
        window.addEventListener('resize', calculateCenterPosition);
        return () =>
            window.removeEventListener('resize', calculateCenterPosition);
    }, [defaultSize.width, defaultSize.height]);

    return (
        <Rnd
            default={{
                ...position,
                width: defaultSize.width,
                height: defaultSize.height,
            }}
            minWidth={minWidth}
            minHeight={minHeight}
            bounds='body'
            style={{ ...style }}
        >
            {content}
        </Rnd>
    );
};

export default DraggableResizableBox;
