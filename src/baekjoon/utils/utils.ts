import sha1 from 'sha1';
import { uploadState } from './variables';

export const isNull = (value: any) => {
    return value === null || value === undefined;
};
export const getVersion = () => {
    return chrome.runtime.getManifest().version;
};
export const filter = (arr: any, conditions: object): any => {
    return arr.filter((item: any) => {
        for (const [key, value] of Object.entries(conditions))
            if (!item[key].includes(value)) return false;
        return true;
    });
};

const maxValuesGroupBykey = <T>(
    arr: T[],
    key: string,
    compare: (a: T, b: T) => number
): T[] => {
    const map: Record<string, T[]> = groupBy(arr, key);
    const result: T[] = [];
    for (const [_, value] of Object.entries(map)) {
        const maxValue = value.reduce((max: T, current: T) => {
            return compare(max, current) > 0 ? max : current;
        });
        result.push(maxValue);
    }
    return result;
};

const groupBy = (array: any, key: any) => {
    return array.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
export const isNotEmpty = (obj: any) => {
    if (isEmpty(obj)) return false;
    if (typeof obj !== 'object') return true;
    if (obj.length === 0) return false;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (!isNotEmpty(obj[key])) return false;
        }
    }
    return true;
};
export const isEmpty = (value: any) => {
    return (
        isNull(value) || (value.hasOwnProperty('length') && value.length === 0)
    );
};

export const calculateBlobSHA = (content: any) => {
    return sha1(`blob ${new Blob([content]).size}\0${content}`);
};

export const parseNumberFromString = (str: any) => {
    const numbers = str.match(/\d+/g);
    if (isNotEmpty(numbers) && numbers.length > 0) {
        return Number(numbers[0]);
    }
    return NaN;
};

export const unescapeHtml = (text: string): string => {
    const unescaped: any = {
        '&amp;': '&',
        '&#38;': '&',
        '&lt;': '<',
        '&#60;': '<',
        '&gt;': '>',
        '&#62;': '>',
        '&apos;': "'",
        '&#39;': "'",
        '&quot;': '"',
        '&#34;': '"',
        '&nbsp;': ' ',
        '&#160;': ' ',
    };
    return text.replace(
        /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160);/g,
        (m: any) => {
            return unescaped[m];
        }
    );
};

export const asyncPool = async (
    poolLimit: number,
    array: any,
    iteratorFn: Function
) => {
    const ret = [];
    const executing: any[] = [];
    for (const item of array) {
        const p = Promise.resolve().then(() => iteratorFn(item, array));
        ret.push(p);

        if (poolLimit <= array.length) {
            const e: any = p.then(() =>
                executing.splice(executing.indexOf(e), 1)
            );
            executing.push(e);
            if (executing.length >= poolLimit) {
                await Promise.race(executing);
            }
        }
    }
    return Promise.all(ret);
};

export const convertSingleCharToDoubleChar = (text: string): string => {
    const map: any = {
        '!': '！',
        '%': '％',
        '&': '＆',
        '(': '（',
        ')': '）',
        '*': '＊',
        '+': '＋',
        ',': '，',
        '-': '－',
        '.': '．',
        '/': '／',
        ':': '：',
        ';': '；',
        '<': '＜',
        '=': '＝',
        '>': '＞',
        '?': '？',
        '@': '＠',
        '[': '［',
        '\\': '＼',
        ']': '］',
        '^': '＾',
        _: '＿',
        '`': '｀',
        '{': '｛',
        '|': '｜',
        '}': '｝',
        '~': '～',
        ' ': ' ',
    };
    return text.replace(
        /[!%&()*+,\-./:;<=>?@\[\\\]^_`{|}~ ]/g,
        function (m: any) {
            return map[m];
        }
    );
};

export const startUpload = () => {
    let elem: any = document.getElementById('AlgoPlus_progress_anchor_element');
    if (elem !== undefined) {
        elem = document.createElement('span');
        elem.id = 'AlgoPlus_progress_anchor_element';
        elem.className = 'runcode-wrapper__8rXm';
        elem.style = 'margin-left: 10px;padding-top: 0px;';
    }
    elem.innerHTML = `<div id="AlgoPlus_progress_elem" class="AlgoPlus_progress"></div>`;
    const target: any =
        document.getElementById('status-table')?.childNodes[1].childNodes[0]
            .childNodes[3] ||
        document.querySelector(
            'div.table-responsive > table > tbody > tr > td:nth-child(5)'
        );
    target.append(elem);
    if (target.childNodes.length > 0) {
        target.childNodes[0].append(elem);
    }
    startUploadCountDown();
};

export const markUploadedCSS = (branches: any, directory: string) => {
    uploadState.uploading = false;
    const elem: any = document.getElementById('AlgoPlus_progress_elem');
    elem.className = 'markuploaded';
    const uploadedUrl =
        'https://github.com/' +
        Object.keys(branches)[0] +
        '/tree/' +
        branches[Object.keys(branches)[0]] +
        '/' +
        directory;
    elem.addEventListener('click', function () {
        window.location.href = uploadedUrl;
    });
    elem.style.cursor = 'pointer';
};

export const markUploadFailedCSS = () => {
    uploadState.uploading = false;
    const elem: any = document.getElementById('AlgoPlus_progress_elem');
    elem.className = 'markuploadfailed';
};

const startUploadCountDown = () => {
    uploadState.uploading = true;
    setTimeout(() => {
        if (uploadState.uploading === true) {
            markUploadFailedCSS();
        }
    }, 10000);
};

const compareSubmission = (a: any, b: any): any => {
    return hasNotSubtask(a.result, b.result)
        ? a.runtime === b.runtime
            ? a.memory === b.memory
                ? a.codeLength === b.codeLength
                    ? -(a.submissionId - b.submissionId)
                    : a.codeLength - b.codeLength
                : a.memory - b.memory
            : a.runtime - b.runtime
        : compareResult(a.result, b.result);
};

const hasNotSubtask = (a: string, b: string): boolean => {
    const aa = parseNumberFromString(a);
    const bb = parseNumberFromString(b);

    if (isNaN(aa) && isNaN(bb)) return true;

    return false;
};

const compareResult = (a: string, b: string): number | undefined => {
    const aa: any = parseNumberFromString(a);
    const bb: any = parseNumberFromString(b);

    if (typeof aa === 'number' && typeof bb === 'number') return -(aa - bb);
    if (isNaN(bb)) return -1;
    if (isNaN(aa)) return 1;
};

export const selectBestSubmissionList = (submissions: any) => {
    if (isNull(submissions) || submissions.length === 0) return [];
    return maxValuesGroupBykey(
        submissions,
        'problemId',
        (a, b) => -compareSubmission(a, b)
    );
};

export function convertResultTableHeader(header: any) {
    switch (header) {
        case '문제번호':
        case '문제':
            return 'problemId';
        case '난이도':
            return 'level';
        case '결과':
            return 'result';
        case '문제내용':
            return 'problemDescription';
        case '언어':
            return 'language';
        case '제출 번호':
            return 'submissionId';
        case '아이디':
            return 'username';
        case '제출시간':
        case '제출한 시간':
            return 'submissionTime';
        case '시간':
            return 'runtime';
        case '메모리':
            return 'memory';
        case '코드 길이':
            return 'codeLength';
        default:
            return 'unknown';
    }
}

export const convertImageTagAbsoluteURL = (doc = document) => {
    if (isNull(doc)) return;
    Array.from(doc.getElementsByTagName('img'), (x) => {
        x.setAttribute('src', x.currentSrc);
        return x;
    });
};

export const getDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
};
