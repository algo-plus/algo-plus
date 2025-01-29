import uuid from 'react-uuid';

type SourceCode = {
    code: string | null;
    lang: string | null;
};

class CommentBlock {
    id: string = uuid();
    oldCode: string = '';
    oldCodeName: string = '이전 코드';
    newCode: string = '';
    newCodeName: string = '변경 코드';
    comment: string = '';

    constructor(data: Partial<CommentBlock> = {}) {
        Object.assign(this, data);
    }
}

const DiffViewerSide = {
    LEFT: 0,
    RIGHT: 1,
} as const;

type DiffViewerSideType = (typeof DiffViewerSide)[keyof typeof DiffViewerSide];

type ReviewMarkdownContent = {
    oldCode?: string;
    newCode?: string;
    commentBlocks?: CommentBlock[];
    comment?: string;
};

export type { SourceCode, DiffViewerSideType, ReviewMarkdownContent };
export { DiffViewerSide, CommentBlock };
