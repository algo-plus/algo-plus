import React from 'react';
import * as Diff from 'diff';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import './Modal.css';

const Modal = () => {
    const closeModal = () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        console.log('close modal');
    };
    const save = () => {
        console.log('save');
    };

    interface CodeDiffProps {
        oldCode: string;
        newCode: string;
    }

    const CodeDiff: React.FC<CodeDiffProps> = ({ oldCode, newCode }) => {
        const generateDiff = () => {
            const diff = Diff.diffLines(oldCode, newCode);
            return diff.map((part, index) => {
                if (part.added) {
                    return (
                        <span
                            key={index}
                            style={{ backgroundColor: 'lightgreen' }}
                        >
                            + {part.value}
                        </span>
                    );
                }
                if (part.removed) {
                    return (
                        <span
                            key={index}
                            style={{ backgroundColor: 'lightcoral' }}
                        >
                            - {part.value}
                        </span>
                    );
                }
                return <span key={index}>{part.value}</span>;
            });
        };

        return <div>{generateDiff()}</div>;
    };

    const oldCode: string = `function greet(name: string) {
        console.log('Hello, ' + name + '!');
      }`;

    const newCode: string = `function greet(name: string) {
        console.log('Hi, ' + name + '!');
      }`;

    return (
        <div className='modal-content'>
            <div className='modal-header' style={{ display: 'flex' }}>
                <h5 className='modal-title'>오답 노트 작성</h5>
                <button
                    type='button'
                    className='close'
                    data-dismiss='modal'
                    aria-label='Close'
                    onClick={closeModal}
                >
                    <span aria-hidden='true'>&times;</span>
                </button>
            </div>
            <div className='modal-body'>
                <div>
                    <h6>코드 비교 결과:</h6>
                    <pre>
                        <CodeDiff oldCode={oldCode} newCode={newCode} />
                    </pre>
                    <ReactDiffViewer
                        oldValue={oldCode}
                        newValue={newCode}
                        compareMethod={DiffMethod.LINES}
                        splitView={true}
                    />
                </div>
                <div>
                    <textarea rows={6} cols={50}></textarea>
                </div>
            </div>
            <div className='modal-footer'>
                <button
                    type='button'
                    className='btn btn-secondary'
                    data-dismiss='modal'
                    onClick={closeModal}
                >
                    취소
                </button>
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={save}
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default Modal;
