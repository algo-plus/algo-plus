import { getUrlSearchParam } from '@/common/utils/url';
import {
    getFirstStatusResultTag,
    isJudgingState,
    isWrongState,
} from '@/baekjoon/utils/status';

const customStatusPageTemp = () => {
    console.log(
        getUrlSearchParam(window.location.href, 'after_algoplus_submit')
    );
    if (
        getUrlSearchParam(window.location.href, 'after_algoplus_submit') ===
        'true'
    ) {
        console.log('채점 전');
        let timer = setInterval(() => {
            if (isJudgingState()) {
                console.log('채점중');
            } else {
                clearInterval(timer);
                console.log(getFirstStatusResultTag());
                if (isWrongState()) {
                    alert(getFirstStatusResultTag());
                }
            }
        }, 500);
    }
};

export default customStatusPageTemp;
