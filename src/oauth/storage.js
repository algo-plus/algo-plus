chrome.storage.local.get('isSync', (data) => {
    keys = [
        'AlgoPlus_token',
        'AlgoPlus_username',
        'pipe_AlgoPlus',
        'stats',
        'AlgoPlus_hook',
        'mode_type',
    ];
    if (!data || !data.isSync) {
        keys.forEach((key) => {
            chrome.storage.sync.get(key, (data) => {
                chrome.storage.local.set({ [key]: data[key] });
            });
        });
        chrome.storage.local.set({ isSync: true }, (data) => {
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

const getObjectFromLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function (value) {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const saveObjectInLocalStorage = async (obj) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set(obj, function () {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const removeObjectFromLocalStorage = async (keys) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.remove(keys, () => {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const getObjectFromSyncStorage = async (key) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, (value) => {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const saveObjectInSyncStorage = async (obj) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set(obj, () => {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const removeObjectFromSyncStorage = async (keys) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.remove(keys, () => {
                resolve();
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

const getToken = async () => {
    return await getObjectFromLocalStorage('AlgoPlus_token');
};

const getGithubUsername = async () => {
    return await getObjectFromLocalStorage('AlgoPlus_username');
};

const getStats = async () => {
    return await getObjectFromLocalStorage('stats');
};

const getHook = async () => {
    return await getObjectFromLocalStorage('AlgoPlus_hook');
};

const getOrgOption = async () => {
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

const getModeType = async () => {
    return await getObjectFromLocalStorage('mode_type');
};

const saveToken = async (token) => {
    return await saveObjectInLocalStorage({ AlgoPlus_token: token });
};

const saveStats = async (stats) => {
    return await saveObjectInLocalStorage({ stats });
};

const updateStatsSHAfromPath = async (path, sha) => {
    const stats = await getStats();
    updateObjectDatafromPath(stats.submission, path, sha);
    await saveStats(stats);
};

const updateObjectDatafromPath = (obj, path, data) => {
    let current = obj;
    const pathArray = _swexpertacademyRankRemoveFilter(
        _baekjoonSpaceRemoverFilter(
            _programmersRankRemoverFilter(_baekjoonRankRemoverFilter(path))
        )
    )
        .split('/')
        .filter((p) => p !== '');
    for (const path of pathArray.slice(0, -1)) {
        if (isNull(current[path])) {
            current[path] = {};
        }
        current = current[path];
    }
    current[pathArray.pop()] = data;
};

const getStatsSHAfromPath = async (path) => {
    const stats = await getStats();
    return getObjectDatafromPath(stats.submission, path);
};

const getObjectDatafromPath = (obj, path) => {
    let current = obj;
    const pathArray = _swexpertacademyRankRemoveFilter(
        _baekjoonSpaceRemoverFilter(
            _programmersRankRemoverFilter(_baekjoonRankRemoverFilter(path))
        )
    )
        .split('/')
        .filter((p) => p !== '');
    for (const path of pathArray.slice(0, -1)) {
        if (isNull(current[path])) {
            return null;
        }
        current = current[path];
    }
    return current[pathArray.pop()];
};

const updateLocalStorageStats = async () => {
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
};

const getDirNameByOrgOption = async (dirName, language) => {
    if ((await getOrgOption()) === 'language')
        dirName = `${language}/${dirName}`;
    return dirName;
};

const _baekjoonRankRemoverFilter = (path) => {
    return path.replace(
        /\/(Unrated|Silver|Bronze|Gold|Platinum|Diamond|Ruby|Master)\//g,
        '/'
    );
};

const _programmersRankRemoverFilter = (path) => {
    return path.replace(/\/(lv[0-9]|unrated)\//g, '/');
};

const _baekjoonSpaceRemoverFilter = (path) => {
    return path.replace(/( | |&nbsp|&#160|&#8197|%E2%80%85|%20)/g, '');
};

const _swexpertacademyRankRemoveFilter = (path) => {
    return path.replace(/\/D([0-8]+)\//g, '/');
};
