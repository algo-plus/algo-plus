type ModalProps = {
    sourceCodes: (CodeProps | null)[];
};

type CodeProps = {
    code: string | null;
    lang: string | null;
};

export type { ModalProps, CodeProps };
