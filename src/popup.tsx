import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        chrome.action.setBadgeText({ text: count.toString() });
    }, [count]);

    return (
        <>
            <ul style={{ minWidth: '400px' }}>
                <li>count: {count}</li>
            </ul>
            <button onClick={() => setCount(count + 1)}>count up</button>
        </>
    );
};

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
