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

getStats().then((stats) => {
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

async function getObjectFromLocalStorage(key) {
    return await new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function saveObjectInLocalStorage(obj) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function removeObjectFromLocalStorage(keys) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.remove(keys, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function getObjectFromSyncStorage(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, function (value) {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function saveObjectInSyncStorage(obj) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set(obj, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function removeObjectFromSyncStorage(keys) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.remove(keys, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

async function getToken() {
    return await getObjectFromLocalStorage('AlgoPlus_token');
}

async function getGithubUsername() {
    return await getObjectFromLocalStorage('AlgoPlus_username');
}

async function getStats() {
    return await getObjectFromLocalStorage('stats');
}

async function getHook() {
    return await getObjectFromLocalStorage('AlgoPlus_hook');
}

async function getOrgOption() {
    try {
        return await getObjectFromLocalStorage('AlgoPlus_OrgOption');
    } catch (ex) {
        console.log(
            'The way it works has changed with updates. Update your storage. '
        );
        chrome.storage.local.set({ AlgoPlus_OrgOption: 'platform' });
        return 'platform';
    }
}

async function getModeType() {
    return getObjectFromLocalStorage('mode_type');
}

async function saveToken(token) {
    return saveObjectInLocalStorage({ AlgoPlus_token: token });
}

async function saveStats(stats) {
    return saveObjectInLocalStorage({ stats });
}

async function updateStatsSHAfromPath(path, sha) {
    const stats = await getStats();
    updateObjectDatafromPath(stats.submission, path, sha);
    await saveStats(stats);
}

function updateObjectDatafromPath(obj, path, data) {
    let current = obj;
    const pathArray = _baekjoonSpaceRemoverFilter(
        _baekjoonRankRemoverFilter(path)
    )
        .split('/')
        .filter((p) => p !== '');
    for (const pArray of pathArray.slice(0, -1)) {
        if (isNull(current[pArray])) {
            current[pArray] = {};
        }
        current = current[pArray];
    }
    current[pathArray.pop()] = data;
}

async function getStatsSHAfromPath(path) {
    const stats = await getStats();
    return getObjectDatafromPath(stats.submission, path);
}

function getObjectDatafromPath(obj, path) {
    let current = obj;
    const pathArray = _baekjoonSpaceRemoverFilter(
        _baekjoonRankRemoverFilter(path)
    )
        .split('/')
        .filter((p) => p !== '');
    for (const pArray of pathArray.slice(0, -1)) {
        if (isNull(current[pArray])) {
            return null;
        }
        current = current[pArray];
    }
    return current[pathArray.pop()];
}

async function updateLocalStorageStats() {
    const hook = await getHook();
    const token = await getToken();
    const git = new GitHub(hook, token);
    const stats = await getStats();
    const tree_items = [];
    await git.getTree().then((tree) => {
        tree.forEach((item) => {
            if (item.type === 'blob') {
                tree_items.push(item);
            }
        });
    });
    const { submission } = stats;
    tree_items.forEach((item) => {
        updateObjectDatafromPath(submission, `${hook}/${item.path}`, item.sha);
    });
    const default_branch = await git.getDefaultBranchOnRepo();
    stats.branches[hook] = default_branch;
    await saveStats(stats);
    return stats;
}

async function getDirNameByOrgOption(dirName, language) {
    if ((await getOrgOption()) === 'language')
        dirName = `${language}/${dirName}`;
    return dirName;
}

function _baekjoonRankRemoverFilter(path) {
    return path.replace(
        /\/(Unrated|Silver|Bronze|Gold|Platinum|Diamond|Ruby|Master)\//g,
        '/'
    );
}

function _baekjoonSpaceRemoverFilter(path) {
    return path.replace(/( | |&nbsp|&#160|&#8197|%E2%80%85|%20)/g, '');
}
