type ReviewMarkdownContent = {
    oldCode?: string;
    newCode?: string;
    commentBlocks?: CommentBlocks;
    comment?: string;
};

type CommentBlocks = {
    id: number;
    selectedOldCode?: string;
    selectedNewCode?: string;
    oldCodeName?: string;
    newCodeName?: string;
    comment?: string;
    isRegistered?: boolean;
}[];
