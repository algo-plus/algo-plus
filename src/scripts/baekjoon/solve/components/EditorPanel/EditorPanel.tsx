import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SolveView } from '../SolveView';

const EditorPanel: React.FC<{ csrfKey: string | null }> = ({ csrfKey }) => {
    useEffect(() => {
        // 기존 에디터 숨기기
        const beforeEditor = document.querySelector(
            '#submit_form > div:nth-child(5) > div.col-md-10'
        ) as HTMLDivElement;
        if (beforeEditor) {
            beforeEditor.style.display = 'none';
        }

        // 기존 제출버튼 숨기기
        const beforeButton = document.querySelector(
            '#submit_form > div:nth-child(7) > div'
        ) as HTMLDivElement;
        if (beforeButton) {
            beforeButton.style.display = 'none';
        }

        const editorDiv: HTMLDivElement = document.createElement('div');
        editorDiv.id = 'editorContainer';
        const child = document.querySelector(
            '#submit_form > div:nth-child(5) > div.col-md-10'
        );
        document
            .querySelector('#submit_form > div:nth-child(5)')
            ?.insertBefore(editorDiv, child);

        const root = createRoot(editorDiv);
        root.render(<SolveView csrfKey={csrfKey} />);
    }, []); // 빈 배열을 전달하여 최초 렌더링 시 한 번만 실행되도록 설정

    return (
        <div id='editorContainer' style={{ height: '100%' }}>
            <div className='form-group'>
                <label className='col-md-2 control-label'>언어</label>
                <div className='col-md-2' style={{ marginTop: '7px' }}>
                    <select
                        id='language'
                        name='language'
                        data-placeholder='언어를 선택해 주세요'
                        className='language-select col-md-12 chosen-select'
                        data-no_results_text='없는 언어 입니다'
                        style={{ display: 'none' }}
                    >
                        <option value='3' data-mime='text/x-java' selected>
                            Java 8
                        </option>
                        <option value='84' data-mime='text/x-c++src'>
                            C++17
                        </option>
                        <option value='28' data-mime='text/x-python'>
                            Python 3
                        </option>
                        <option value='73' data-mime='text/x-python'>
                            PyPy3
                        </option>
                        <option value='0' data-mime='text/x-csrc'>
                            C99
                        </option>
                        <option value='93' data-mime='text/x-java'>
                            Java 11
                        </option>
                        <option value='68' data-mime='text/x-ruby'>
                            Ruby
                        </option>
                        <option value='69' data-mime='text/x-kotlin'>
                            Kotlin (JVM)
                        </option>
                        <option value='74' data-mime='text/x-swift'>
                            Swift
                        </option>
                        <option value='58' data-mime='text/plain'>
                            Text
                        </option>
                        <option value='86' data-mime='text/x-csharp'>
                            C#
                        </option>
                        <option value='17' data-mime='text/javascript'>
                            node.js
                        </option>
                        <option value='12' data-mime='text/x-go'>
                            Go
                        </option>
                        <option value='29' data-mime='text/x-d'>
                            D
                        </option>
                        <option value='94' data-mime='text/x-rustsrc'>
                            Rust 2018
                        </option>
                        <option value='85' data-mime='text/x-c++src'>
                            C++17 (Clang)
                        </option>
                    </select>
                    <div
                        className='chosen-container chosen-container-single'
                        title=''
                        id='language_chosen'
                        style={{ width: '165px' }}
                    >
                        <a className='chosen-single'>
                            <span>Java 8</span>
                            <div>
                                <b></b>
                            </div>
                        </a>
                        <div className='chosen-drop'>
                            <div className='chosen-search'>
                                {/* <input className="chosen-search-input" type="text" autocomplete="off"> */}
                            </div>
                            <ul className='chosen-results'>
                                <li
                                    className='active-result result-selected'
                                    data-option-array-index='0'
                                >
                                    Java 8
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='1'
                                >
                                    C++17
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='2'
                                >
                                    Python 3
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='3'
                                >
                                    PyPy3
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='4'
                                >
                                    C99
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='5'
                                >
                                    Java 11
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='6'
                                >
                                    Ruby
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='7'
                                >
                                    Kotlin (JVM)
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='8'
                                >
                                    Swift
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='9'
                                >
                                    Text
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='10'
                                >
                                    C#
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='11'
                                >
                                    node.js
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='12'
                                >
                                    Go
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='13'
                                >
                                    D
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='14'
                                >
                                    Rust 2018
                                </li>
                                <li
                                    className='active-result'
                                    data-option-array-index='15'
                                >
                                    C++17 (Clang)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p
                    style={{ paddingTop: '7px' }}
                    className='hidden-xs hidden-sm'
                >
                    <a href='/setting/language'>언어 설정</a>
                </p>
            </div>

            <SolveView csrfKey={csrfKey} />
        </div>
    );
};

export default EditorPanel;
