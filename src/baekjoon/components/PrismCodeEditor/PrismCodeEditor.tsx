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
        const options = { ...props, tabSize: 4, wordWrap: true };

        useEffect(() => {
            editorRef.current?.setOptions(options);
        }, [props]);

        useEffect(() => {
            const editor = (editorRef.current = basicEditor(
                divRef.current!,
                props
            ));
            if (editorRef.current) {
            }
            editorRef.current?.setOptions(options);
            editorRef.current && updateTheme(editorRef.current, props.theme);
            if (editorRef.current) {
                editorRef.current.wrapper.style.wordBreak = 'break-all';
            }
            if (ref)
                typeof ref == 'function' ? ref(editor) : (ref.current = editor);

            return editor.remove;
        }, [props.language, props.theme]);

        return <div className='prism-editor-react' ref={divRef} />;
    }
);

export default PrismCodeEditor;
