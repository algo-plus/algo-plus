import { getUrlSearchParam } from '@/common/utils/url';
import {
    getFirstStatusResultTag,
    isJudgingState,
    isWrongState,
} from '@/baekjoon/utils/status';

const customStatusPageTemp = () => {
    if (
        getUrlSearchParam(window.location.href, 'after_algoplus_submit') ===
        'true'
    ) {
        let timer = setInterval(() => {
            if (isJudgingState()) {
            } else {
                clearInterval(timer);
                if (isWrongState()) {
                    alert(getFirstStatusResultTag());
                }
            }
        }, 500);
    }
};

export default customStatusPageTemp;
