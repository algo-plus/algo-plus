import React from 'react';
import './ReviewWriteCodeBlock.css';

type ReviewWriteCodeBlockProps = {
    icon?: string;
    code: string;
    codeName: string;
    onChangeCodeName: (codeName: string) => void;
};

const ReviewWriteCodeBlock: React.FC<ReviewWriteCodeBlockProps> = (
    props: ReviewWriteCodeBlockProps
) => {
    return (
        <div className='review-write-code-block'>
            {props.code ? (
                <>
                    <div className='code-name-input'>
                        <label>{props.icon}</label>
                        <input
                            type='text'
                            defaultValue={props.codeName}
                            onChange={(event) =>
                                props.onChangeCodeName(event.target.value)
                            }
                            spellCheck={false}
                        ></input>
                    </div>
                    <pre>{props.code}</pre>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default ReviewWriteCodeBlock;
