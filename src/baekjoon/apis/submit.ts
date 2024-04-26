import axios, { AxiosResponse } from 'axios';
import { SubmitPostRequest } from '../types/submit';

async function submit(
    data: SubmitPostRequest,
    success: (response: AxiosResponse) => void,
    fail: (error: any) => void
) {
    axios
        .post('/submit/' + data.problem_id, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(success)
        .catch(fail);
}

export { submit };
