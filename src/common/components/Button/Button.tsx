import React from 'react';
import './Button.css';

const Button = (props: {
    text: string;
    onClick: (event: any) => void;
    style?: React.CSSProperties;
}) => {
    return (
        <button
            className='algoplus-button'
            style={{ ...props.style }}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default Button;
