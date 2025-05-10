type SubmitPostRequest = {
    'g-recaptcha-response': string;
    problem_id: string;
    language: number;
    code_open: CodeOpen;
    source: string;
    csrf_key: string;
};

type CodeOpen = 'open' | 'close' | 'onlyaccepted';

export type { SubmitPostRequest, CodeOpen };
