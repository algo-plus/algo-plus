import { isJudgingState } from './../../baekjoon/utils/status';
import {
    CodeCompileRequest
} from '@/common/types/compile';

async function compile(data: CodeCompileRequest) {
    console.log('jdoodle data: ', data);
    const response = await fetch(
        'https://snctz97usk.execute-api.ap-northeast-2.amazonaws.com/api/jdoodle',
        {
            method: 'POST',
            body: JSON.stringify(data),
        }
    );
    const json = await response.json();
    console.log('jdoodle response.json(): ', json.output.trim());
    return json.output.trim();
}

export { compile };
