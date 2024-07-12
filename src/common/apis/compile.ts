import { isJudgingState } from './../../baekjoon/utils/status';
import {
    CodeCompileRequest,
    CodeCompileRequest2,
} from '@/common/types/compile';

// update jdoodle api

const url = 'https://code-compiler10.p.rapidapi.com/';
const url2 = 'https://api.jdoodle.com/v1/execute';

const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-compile': 'rapidapi',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY as string,
    'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST as string,
};

const headers2 = {
    'Content-Type': 'application/json',
};

async function compile(data: CodeCompileRequest) {
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    });
    const json = await response.json();
    return json.output.trim();
}

// async function compile2(data: CodeCompileRequest2) {
//     const response = await fetch(url2, {
//         method: 'POST',
//         headers: headers2,
//         body: JSON.stringify(data),
//     });
//     const json = await response.json();
//     return json.output.trim();
// }

async function compile2(data: CodeCompileRequest2) {
    console.log('jdoodle data: ', data);
    const response = await fetch(
        'https://snctz97usk.execute-api.ap-northeast-2.amazonaws.com/api/jdoodle',
        {
            method: 'POST',
            body: JSON.stringify(data),
        }
    );
    const json = await response.json();
    console.log('jdoodle response: ', response);
    return json.output.trim();
}

export { compile, compile2 };
