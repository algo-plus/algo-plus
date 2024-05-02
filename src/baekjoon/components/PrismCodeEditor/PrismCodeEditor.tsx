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
            editorRef.current && updateTheme(editorRef.current, props.theme);
        }, [props.theme]);

        useEffect(() => {
            const editor = (editorRef.current = basicEditor(
                divRef.current!,
                props
            ));

            if (ref)
                typeof ref == 'function' ? ref(editor) : (ref.current = editor);

            return editor.remove;
        }, [props.language]);

        return <div className='prism-editor-react' ref={divRef} />;
    }
);

export default PrismCodeEditor;
