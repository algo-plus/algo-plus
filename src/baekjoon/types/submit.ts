type SubmitPostRequest = {
    'cf-turnstile-response': string;
    problem_id: string;
    language: number;
    code_open: CodeOpen;
    source: string;
};

type CodeOpen = 'open' | 'close' | 'onlyaccepted';

export type { SubmitPostRequest, CodeOpen };
