import React from 'react';
import './ReviewWriteCodeBlock.css';

type ReviewWriteCodeBlockProps = {
    icon?: string;
    code: string;
    codeName: string;
    onChangeCodeName: (codeName: string) => void;
    readonly?: boolean;
};

const ReviewWriteCodeBlock: React.FC<ReviewWriteCodeBlockProps> = (
    props: ReviewWriteCodeBlockProps
) => {
    return (
        <div
            className={`review-write-code-block ${
                props.readonly ? 'readonly' : ''
            }`}
        >
            <div className='code-name-input'>
                <label>{props.icon}</label>
                <input
                    type='text'
                    defaultValue={props.codeName}
                    onChange={(event) =>
                        props.onChangeCodeName(event.target.value)
                    }
                    spellCheck={false}
                    disabled={props.readonly}
                ></input>
            </div>
            <pre>{props.code}</pre>
        </div>
    );
};

export default ReviewWriteCodeBlock;
