import { CodeCompileRequest } from '@/types/compile';
import axios, { AxiosResponse } from 'axios';

const baseUrl: string = 'https://api.jdoodle.com/v1/execute';

async function compile(
    data: CodeCompileRequest,
    success: (response: AxiosResponse) => void,
    fail: (error: any) => void
) {
    console.log(data);
    const apiRequest: JDoodleCompileApiRequest = {
        clientId: process.env.REACT_APP_JDOODLE_CLIENT_ID,
        clientSecret: process.env.REACT_APP_JDOODLE_CLIENT_SECRET,
        script: data.code,
        language: data.language,
        versionIndex: data.versionIndex,
    };

    axios
        .post(baseUrl, apiRequest, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(success)
        .catch(fail);
}

type JDoodleCompileApiRequest = {
    clientId: string | undefined;
    clientSecret: string | undefined;
    script: string;
    language: string;
    versionIndex: number;
};

export { compile };
