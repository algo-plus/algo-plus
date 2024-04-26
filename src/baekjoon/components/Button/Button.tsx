import React from 'react';
import './Button.css';

const Button = (props: { text: string; onClick: (event: any) => void }) => {
    return <button onClick={props.onClick}>{props.text}</button>;
};

export default Button;
