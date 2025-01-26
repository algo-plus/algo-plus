type ModalProps = {
    sourceCodes: (SourceCode | null)[];
};

type SourceCode = {
    code: string | null;
    lang: string | null;
};

export type { ModalProps, SourceCode };
