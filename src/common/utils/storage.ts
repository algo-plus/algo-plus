interface StorageObject {
    [key: string]: any;
}

const getObjectFromLocalStorage = async (key: string): Promise<any> => {
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

const saveObjectInLocalStorage = async (obj: StorageObject): Promise<void> => {
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

const removeObjectFromLocalStorage = async (keys: string): Promise<void> => {
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

const getProblems = async (): Promise<JSX.Element> => {
    return await getObjectFromLocalStorage('problem');
};

export {
    getObjectFromLocalStorage,
    saveObjectInLocalStorage,
    removeObjectFromLocalStorage,
    getProblems,
};
