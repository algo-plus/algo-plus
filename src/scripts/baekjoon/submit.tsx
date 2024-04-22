import { SubmitPostRequest } from './types/submit';
import { submit } from './apis/submit';

const customSubmitPage = (): void => {
    console.log('custom submit page...');

    const submitHandle = (event: Event) => {
        event.preventDefault();
        const csrfKey = (
            document.querySelector(
                '#submit_form > input[name=csrf_key]'
            ) as HTMLInputElement
        ).value;

        // TODO: 더미 데이터 제거 후 에디터 연결
        const data: SubmitPostRequest = {
            problem_id: 1000,
            language: 0,
            code_open: 'onlyaccepted',
            source: '#include <stdio.h>\n\nint main()\n{\n    int a,b;\n    scanf("%d",&a);\n    scanf("%d",&b);\n    printf("%d",a+b);\n    return 0;\n}',
            csrf_key: csrfKey,
        };

        submit(
            data,
            (response) => {
                const responseURL = response.request.responseURL;
                if (responseURL) {
                    console.log('code submit... responseURL=' + responseURL);
                    // TODO: 코드 제출 후 로직 작성
                }
            },
            console.error
        );
    };

    const mySubmitButton = document.createElement('button');
    mySubmitButton.innerText = '제출 테스트';
    mySubmitButton.addEventListener('click', submitHandle);

    const buttonContainer = document.querySelector(
        '#submit_form > div:nth-child(7) > div'
    ) as HTMLDivElement;
    buttonContainer.appendChild(mySubmitButton);
};

export default customSubmitPage;
