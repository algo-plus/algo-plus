import React from 'react';
import './OverlayNotification.css';

type OverlayNotification = {
    id?: string;
    show: boolean;
    message: string;
};

const Spinner: React.FC<OverlayNotification> = (props: OverlayNotification) => {
    return (
        <div
            id={`${props.id ? props.id : ''}`}
            className='algoplus-overlay-notification'
            style={{
                display: props.show ? 'block' : 'none',
            }}
        >
            <div className='notification-container'>
                <p>{props.message}</p>
            </div>
        </div>
    );
};

export default Spinner;
