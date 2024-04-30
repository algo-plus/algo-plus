import { getUrlSearchParam } from '@/common/utils/url';
import {
    getFirstStatusResultTag,
    isJudgingState,
    isWrongState,
} from '@/baekjoon/utils/status';

const customStatusPageTemp = () => {
<<<<<<< HEAD
    console.log(
        getUrlSearchParam(window.location.href, 'after_algoplus_submit')
    );
=======
>>>>>>> 59fd25a (Feat: 문제 풀이 화면에서 제출 후 채점 상태 띄우기 구현)
    if (
        getUrlSearchParam(window.location.href, 'after_algoplus_submit') ===
        'true'
    ) {
<<<<<<< HEAD
        console.log('채점 전');
        let timer = setInterval(() => {
            if (isJudgingState()) {
                console.log('채점중');
            } else {
                clearInterval(timer);
                console.log(getFirstStatusResultTag());
=======
        let timer = setInterval(() => {
            if (isJudgingState()) {
            } else {
                clearInterval(timer);
>>>>>>> 59fd25a (Feat: 문제 풀이 화면에서 제출 후 채점 상태 띄우기 구현)
                if (isWrongState()) {
                    alert(getFirstStatusResultTag());
                }
            }
        }, 500);
    }
};

export default customStatusPageTemp;
