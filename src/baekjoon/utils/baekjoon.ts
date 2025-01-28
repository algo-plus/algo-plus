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

let loader: ReturnType<typeof setInterval> | null = null;

export const startLoader = async (content: string, closeEvent: Function) => {
    showUploadSpinner();
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
                    console.log('깃허브 업로드를 시작합니다.');
                    startUpload();
                    const bojData = await findData();
                    await beginUpload(bojData, content);
                }
            }
        }
    }, 2000);
    setTimeout(() => {
        closeEvent();
    }, 3000);
};

const stopLoader = () => {
    if (loader !== null) {
        clearInterval(loader);
        loader = null;
    }
};

const checkEnable = async () => {
    const enable = await getObjectFromLocalStorage('alpEnable');
    hideUploadSpinner();
    enable ? showUploadSuccessNotification() : writeEnableMsgOnLog();
    return enable;
};

const showUploadSuccessNotification = () => {
    const uploadSuccessNotification = document.querySelector(
        '#review-note-success-notification'
    ) as HTMLDivElement;
    uploadSuccessNotification.style.display = 'block';
};

const writeEnableMsgOnLog = () => {
    const errMsg =
        '확장이 활성화되지 않았습니다. 확장을 활성화하고 시도해주세요';
    alert(errMsg);
};

const showUploadSpinner = () => {
    getSpinnerElement().style.display = 'block';
};

const hideUploadSpinner = () => {
    getSpinnerElement().style.display = 'none';
};

const getSpinnerElement = (): HTMLDivElement => {
    return document.querySelector(
        '#review-note-upload-spinner'
    ) as HTMLDivElement;
};

const beginUpload = async (bojData: any, content: string) => {
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

    await uploadOneSolveProblemOnGit(bojData, content, markUploadedCSS);
};

const versionUpdate = async () => {
    const stats = await updateLocalStorageStats();
    stats.version = getVersion();
    await saveStats(stats);
};
