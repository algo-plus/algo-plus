type SubmitPostRequest = {
    problem_id: string;
    language: number;
    code_open: string;
    source: string;
    csrf_key: string;
};

export type { SubmitPostRequest };
