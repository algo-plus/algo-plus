type CodeStorageSaveInfo = {
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

export type { CodeStorageSaveInfo, CodeInfo };
