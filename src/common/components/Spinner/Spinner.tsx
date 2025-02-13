import React from 'react';
import './Spinner.css';

type SpinnerProps = {
    id?: string;
    show: boolean;
};

const Spinner: React.FC<SpinnerProps> = (props: SpinnerProps) => {
    return (
        <div
            id={`${props.id ? props.id : ''}`}
            className='algoplus-spinner'
            style={{
                display: props.show ? 'block' : 'none',
            }}
        >
            <div className='spinner-container'>
                <div className='spinner'></div>
            </div>
        </div>
    );
};

export default Spinner;
