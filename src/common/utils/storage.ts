import { isNull, getVersion } from '@/baekjoon/utils/utils';
import { GitHub } from '@/baekjoon/utils/github';

interface StorageObject {
    [key: string]: any;
}

chrome.storage.local.get('isSync', (data) => {
    const keys = [
        'AlgoPlus_token',
        'AlgoPlus_username',
        'pipe_AlgoPlus',
        'stats',
        'AlgoPlus_hook',
        'mode_type',
    ];
    if (!data || !data.isSync) {
        keys.forEach((key) => {
            chrome.storage.sync.get(key, (val) => {
                chrome.storage.local.set({ [key]: val[key] });
            });
        });
        chrome.storage.local.set({ isSync: true }, () => {
            console.log('AlgoPlus Synced to local values');
        });
    } else {
        console.log('AlgoPlus Local storage already synced!');
    }
});

export const getObjectFromLocalStorage = async (key: string): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        try {
            chrome.storage.local.get(key, (value: StorageObject) => {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

export const getStats = async () => {
    return await getObjectFromLocalStorage('stats');
};

export const getToken = async () => {
    return await getObjectFromLocalStorage('AlgoPlus_token');
};

export const getGithubUsername = async () => {
    return await getObjectFromLocalStorage('AlgoPlus_username');
};

export const getHook = async () => {
    return await getObjectFromLocalStorage('AlgoPlus_hook');
};

getStats().then((stats: any) => {
    if (isNull(stats)) stats = {};
    if (isNull(stats.version)) stats.version = '0.0.0';
    if (isNull(stats.branches) || stats.version !== getVersion())
        stats.branches = {};
    if (isNull(stats.submission) || stats.version !== getVersion())
        stats.submission = {};
    if (isNull(stats.problems) || stats.version !== getVersion())
        stats.problems = {};
    saveStats(stats);
});

export const updateObjectDatafromPath = (obj: any, path: string, data: any) => {
    let current = obj;
    const pathArray: any = _baekjoonSpaceRemoverFilter(
        _baekjoonRankRemoverFilter(path)
    )
        .split('/')
        .filter((p: string) => p !== '');
    for (const path of pathArray.slice(0, -1)) {
        if (isNull(current[path])) {
            current[path] = {};
        }
        current = current[path];
    }
    current[pathArray.pop()] = data;
};
export const getStatsSHAfromPath = async (path: string): Promise<string> => {
    const stats: any = await getStats();
    return getObjectDatafromPath(stats.submission, path);
};

export const _baekjoonRankRemoverFilter = (path: string): string => {
    return path.replace(
        /\/(Unrated|Silver|Bronze|Gold|Platinum|Diamond|Ruby|Master)\//g,
        '/'
    );
};

export const _baekjoonSpaceRemoverFilter = (path: string): string => {
    return path.replace(/( | |&nbsp|&#160|&#8197|%E2%80%85|%20)/g, '');
};

export const getObjectDatafromPath = (obj: any, path: string) => {
    let current = obj;
    const pathArray: any = _baekjoonSpaceRemoverFilter(
        _baekjoonRankRemoverFilter(path)
    )
        .split('/')
        .filter((p: string) => p !== '');
    for (const path of pathArray.slice(0, -1)) {
        if (isNull(current[path])) {
            return null;
        }
        current = current[path];
    }
    return current[pathArray.pop()];
};

export const updateLocalStorageStats = async () => {
    const hook: any = await getHook();
    const token: any = await getToken();
    const git = new GitHub(hook, token);
    const stats: any = await getStats();
    const tree_items: any[] = [];
    await git.getTree().then((tree) => {
        tree.forEach((item: any) => {
            if (item.type === 'blob') {
                tree_items.push(item);
            }
        });
    });
    const { submission }: any = stats;
    tree_items.forEach((item) => {
        updateObjectDatafromPath(submission, `${hook}/${item.path}`, item.sha);
    });
    const default_branch = await git.getDefaultBranchOnRepo();
    stats.branches[hook] = default_branch;
    await saveStats(stats);
    return stats;
};

export const getDirNameByOrgOption = async (
    dirName: string,
    language: string
) => {
    if ((await getOrgOption()) === 'language')
        dirName = `${language}/${dirName}`;
    return dirName;
};

export const getOrgOption = async () => {
    try {
        return await getObjectFromLocalStorage('AlgoPlus_OrgOption');
    } catch (ex) {
        console.log(
            'The way it works has changed with updates. Update your storage. '
        );
        chrome.storage.local.set({ AlgoPlus_OrgOption: 'platform' }, () => {});
        return 'platform';
    }
};

export const saveStats = async (stats: any) => {
    return await saveObjectInLocalStorage({ stats });
};

export const getObjectFromSyncStorage = async (key: string) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, function (value) {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

export const saveObjectInSyncStorage = async (obj: any) => {
    return new Promise<void>((resolve, reject) => {
        try {
            chrome.storage.sync.set(obj, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

export const removeObjectFromSyncStorage = async (keys: any) => {
    return new Promise<void>((resolve, reject) => {
        try {
            chrome.storage.sync.remove(keys, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

export const saveObjectInLocalStorage = async (
    obj: StorageObject
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, () => {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

export const removeObjectFromLocalStorage = async (
    keys: string
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            chrome.storage.local.remove(keys, () => {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

export const getProblems = async (): Promise<JSX.Element> => {
    return await getObjectFromLocalStorage('problem');
};
