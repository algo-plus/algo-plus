import React from 'react';
import { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import { PrismEditor } from 'prism-code-editor';
import {
    basicEditor,
    SetupOptions,
    updateTheme,
} from 'prism-code-editor/setups';

export const PrismCodeEditor = forwardRef(
    (props: SetupOptions, ref: ForwardedRef<PrismEditor>) => {
        const divRef = useRef<HTMLDivElement>(null);
        const editorRef = useRef<PrismEditor>();

        useEffect(() => {
            editorRef.current?.setOptions(props);
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
        }, []);

        return <div className='prism-editor-react' ref={divRef} />;
    }
);
