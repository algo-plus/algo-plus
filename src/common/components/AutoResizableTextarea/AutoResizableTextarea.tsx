import React, { useState, ChangeEvent, forwardRef } from 'react';
import './AutoResizableTextarea.css';

type AutoResizableTextareaProps = {
    defaultRow?: number;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
};

const AutoResizableTextarea = forwardRef<
    HTMLTextAreaElement,
    AutoResizableTextareaProps
>((props, ref) => {
    const MIN_ROW: number = 2;
    const [rows, setRows] = useState(
        props.defaultRow || getOptimalRows(props.defaultValue) || MIN_ROW
    );
    const [value, setValue] = useState(props.defaultValue || '');

    const resize = (value: string) => {
        setRows(
            Math.max(
                props.defaultRow ? props.defaultRow : MIN_ROW,
                getOptimalRows(value)
            )
        );
    };

    function getOptimalRows(value: string | undefined): number {
        if (!value) return MIN_ROW;
        return value.split('\n').length;
    }

    return (
        <textarea
            ref={ref}
            className='algoplus-auto-resizable'
            rows={rows}
            onChange={(event) => {
                setValue(event.target.value);
                props.onChange && props.onChange(event);
                resize(event.target.value);
            }}
            spellCheck={false}
            value={value}
            disabled={props.disabled}
            placeholder={props.placeholder}
        />
    );
});

export default AutoResizableTextarea;
