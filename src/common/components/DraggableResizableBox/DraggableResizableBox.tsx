import React from 'react';
import './DraggableResizableBox.css';
import { Rnd } from 'react-rnd';

type DraggableResizableBoxProps = {
    content: JSX.Element;
    style?: React.CSSProperties;
};

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = (
    props: DraggableResizableBoxProps
) => {
    return (
        <Rnd
            default={{
                x: 0,
                y: 0,
                width: 500,
                height: 300,
            }}
            minWidth={400}
            minHeight={200}
            bounds='window'
            style={{ ...props.style }}
        >
            {props.content}
        </Rnd>
    );
};

export default DraggableResizableBox;
