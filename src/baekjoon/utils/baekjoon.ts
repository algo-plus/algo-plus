import {
    isNull,
    getVersion,
    isEmpty,
    isNotEmpty,
    calculateBlobSHA,
} from './utils';

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
    parseProblemDescription,
    isExistResultTable,
    findFromResultTable,
    findData,
} from './parse';

const debug = false;

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

const currentUrl = window.location.href;

export const startLoader = () => {
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
                    console.log('bojData: ' + bojData);
                    await beginUpload(bojData);
                }
            }
        }
    }, 2000);
};

const username = findUsername();
if (!isNull(username)) {
    if (
        ['status', `user_id=${username}`, 'problem_id', 'from_mine=1'].every(
            (key) => currentUrl.includes(key)
        )
    )
        startLoader();
    else if (currentUrl.match(/\.net\/problem\/\d+/) !== null)
        parseProblemDescription();
}

const stopLoader = () => {
    clearInterval(loader);
    loader = null;
};

const beginUpload = async (bojData: any) => {
    if (isNotEmpty(bojData)) {
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

        const cachedSHA = await getStatsSHAfromPath(
            `${hook}/${bojData.directory}/${bojData.fileName}`
        );
        const calcSHA = calculateBlobSHA(bojData.code);

        if (cachedSHA == calcSHA) {
            markUploadedCSS(stats.branches, bojData.directory);
            console.log(`현재 제출번호를 업로드한 기록이 있습니다.`);
            return;
        }
        await uploadOneSolveProblemOnGit(bojData, markUploadedCSS);
    }
};

const versionUpdate = async () => {
    console.log('start versionUpdate');
    const stats = await updateLocalStorageStats();
    stats.version = getVersion();
    await saveStats(stats);
    console.log('stats updated.', stats);
};
