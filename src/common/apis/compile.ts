import { CodeCompileRequest } from '@/common/types/compile';

const url = 'https://code-compiler10.p.rapidapi.com/';
const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-compile': 'rapidapi',
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY as string,
    'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST as string,
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

export { compile };
