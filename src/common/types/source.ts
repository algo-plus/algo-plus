type SourceCode = {
    code: string | null;
    lang: string | null;
};

class CodeBlock {
    oldCode: string = '';
    oldCodeName: string = '이전 코드';
    newCode: string = '';
    newCodeName: string = '변경 코드';
    comment: string = '';
    isRegistered: boolean = false;

    constructor(data: Partial<CodeBlock> = {}) {
        Object.assign(this, data);
    }
}

const DiffViewerSide = {
    LEFT: 0,
    RIGHT: 1,
} as const;

type DiffViewerSideType = (typeof DiffViewerSide)[keyof typeof DiffViewerSide];

export type { SourceCode, DiffViewerSideType };
export { DiffViewerSide, CodeBlock };
