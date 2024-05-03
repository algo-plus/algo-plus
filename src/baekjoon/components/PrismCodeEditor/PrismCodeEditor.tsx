import React from 'react';
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import { PrismEditor } from 'prism-code-editor';
import {
    basicEditor,
    SetupOptions,
    updateTheme,
} from 'prism-code-editor/setups';
import 'prism-code-editor/prism/languages';

const PrismCodeEditor = forwardRef(
    (props: SetupOptions, ref: ForwardedRef<PrismEditor>) => {
        const divRef = useRef<HTMLDivElement>(null);
        const editorRef = useRef<PrismEditor>();

        useEffect(() => {
            editorRef.current?.setOptions({
                ...props,
                tabSize: 4,
                wordWrap: true,
            });
        }, [props]);

        useEffect(() => {
            const editor = (editorRef.current = basicEditor(
                divRef.current!,
                props
            ));
            editorRef.current && updateTheme(editorRef.current, props.theme);

            if (ref)
                typeof ref == 'function' ? ref(editor) : (ref.current = editor);

            return editor.remove;
        }, [props.language, props.theme]);

        // 에디터 줄 바꿈 없이 에디터 내부에 wrapping 되도록 설정
        useEffect(() => {
            if (editorRef.current) {
                editorRef.current.wrapper.style.wordBreak = 'break-all';
            }
        }, [editorRef.current]);

        return <div className='prism-editor-react' ref={divRef} />;
    }
);

export default PrismCodeEditor;
