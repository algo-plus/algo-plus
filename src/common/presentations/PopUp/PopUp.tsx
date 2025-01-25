import React from 'react';
import './PopUp.css';

type PopUpProps = {
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    content: JSX.Element;
};

const PopUp: React.FC<PopUpProps> = ({ width, height, style, content }) => {
    return (
        <div
            className='algoplus-pop-up'
            style={{ ...style, width: width, height: height }}
        >
            {content}
        </div>
    );
};

export default PopUp;
