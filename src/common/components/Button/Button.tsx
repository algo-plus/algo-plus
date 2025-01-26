import React from 'react';
import './Button.css';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

const Button = (props: {
    text: string;
    onClick: (event: any) => void;
    style?: React.CSSProperties;
}) => {
    return (
        <button
            className='review-note-pop-up__button'
            style={{ ...style }}
            onClick={props.onClick}
        >
            {props.text}
        </button>
    );
};

export default Button;
