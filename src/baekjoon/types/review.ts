// type ReviewMarkdownContent = {
//     oldCode?: string;
//     newCode?: string;
//     commentBlocks?: CommentBlocks;
//     comment?: string;
// };

// type CommentBlocks = {
//     id: number;
//     selectedOldCode?: string;
//     selectedNewCode?: string;
//     oldCodeName?: string;
//     newCodeName?: string;
//     comment?: string;
//     isRegistered?: boolean;
// }[];

type CodeInfoModalProps = {
    problemId: number;
    submissionNumber: number;
    memory: number;
    time: number;
    result: string;
};

type CodeInfo = {
    submissionId: string;
    memory: string;
    time: string;
    language: string;
    result: string;
};
