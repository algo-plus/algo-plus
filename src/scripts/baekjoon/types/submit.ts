type SubmitPostRequest = {
    problem_id: number;
    language: number;
    code_open: 'open' | 'close' | 'onlyaccepted';
    source: string;
    csrf_key: string;
};

export type { SubmitPostRequest };
