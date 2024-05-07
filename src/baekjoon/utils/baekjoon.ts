import { isNull, getVersion, isEmpty } from './utils';

import {
    getStats,
    getHook,
    getStatsSHAfromPath,
    updateLocalStorageStats,
    saveStats,
    getObjectFromLocalStorage,
} from '@/common/utils/storage';

import { RESULT_CATEGORY } from './variables';
import { uploadOneSolveProblemOnGit } from './uploadfunctions';
import { startUpload, markUploadedCSS } from './utils';

import {
    findUsername,
    isExistResultTable,
    findFromResultTable,
    findData,
} from './parse';

const checkEnable = async () => {
    const enable = await getObjectFromLocalStorage('alpEnable');
    if (!enable) writeEnableMsgOnLog();
    return enable;
};

const writeEnableMsgOnLog = () => {
    const errMsg =
        '확장이 활성화되지 않았습니다. 확장을 활성화하고 시도해주세요';
    console.log(errMsg);
};

let loader: any;

export const startLoader = async () => {
    loader = setInterval(async () => {
        const enable = await checkEnable();
        if (!enable) stopLoader();
        else if (isExistResultTable()) {
            const table = findFromResultTable();
            if (isEmpty(table)) return;
            const data = table[0];
            if (
                data.hasOwnProperty('username') &&
                data.hasOwnProperty('resultCategory')
            ) {
                const { username, resultCategory } = data;
                if (
                    username === findUsername() &&
                    resultCategory.includes(RESULT_CATEGORY.RESULT_ACCEPTED)
                ) {
                    stopLoader();
                    console.log('풀이가 맞았습니다. 업로드를 시작합니다.');
                    startUpload();
                    const bojData = await findData();
                    await beginUpload(bojData);
                }
            }
        }
    }, 2000);
};

const stopLoader = () => {
    clearInterval(loader);
    loader = null;
};

const beginUpload = async (bojData: any) => {
    const stats: any = await getStats();
    const hook: any = await getHook();

    const currentVersion = stats.version;
    if (
        isNull(currentVersion) ||
        currentVersion !== getVersion() ||
        isNull(await getStatsSHAfromPath(hook))
    ) {
        await versionUpdate();
    }

    await uploadOneSolveProblemOnGit(bojData, markUploadedCSS);
};

const versionUpdate = async () => {
    const stats = await updateLocalStorageStats();
    stats.version = getVersion();
    await saveStats(stats);
};
