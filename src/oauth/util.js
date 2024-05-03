function getVersion() {
    return chrome.runtime.getManifest().version;
}

function elementExists(element) {
    return (
        element !== undefined &&
        element !== null &&
        element.hasOwnProperty('length') &&
        element.length > 0
    );
}

function isNull(value) {
    return value === null || value === undefined;
}

function isEmpty(value) {
    return (
        isNull(value) || (value.hasOwnProperty('length') && value.length === 0)
    );
}

function isNotEmpty(obj) {
    if (isEmpty(obj)) return false;
    if (typeof obj !== 'object') return true;
    if (obj.length === 0) return false;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (!isNotEmpty(obj[key])) return false;
        }
    }
    return true;
}
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

String.prototype.escapeHtml = function () {
    return escapeHtml(this);
};

function unescapeHtml(text) {
    const unescaped = {
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
        function (m) {
            return unescaped[m];
        }
    );
}

String.prototype.unescapeHtml = function () {
    return unescapeHtml(this);
};

function convertSingleCharToDoubleChar(text) {
    const map = {
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
    return text.replace(/[!%&()*+,\-./:;<=>?@\[\\\]^_`{|}~ ]/g, function (m) {
        return map[m];
    });
}

function b64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(
            /%([0-9A-F]{2})/g,
            function (match, p1) {
                return String.fromCharCode(`0x${p1}`);
            }
        )
    );
}

function b64DecodeUnicode(b64str) {
    return decodeURIComponent(
        atob(b64str)
            .split('')
            .map(function (c) {
                return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
            })
            .join('')
    );
}

function parseNumberFromString(str) {
    const numbers = str.match(/\d+/g);
    if (isNotEmpty(numbers) && numbers.length > 0) {
        return Number(numbers[0]);
    }
    return NaN;
}

function groupBy(array, key) {
    return array.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

function maxValuesGroupBykey(arr, key, compare) {
    const map = groupBy(arr, key);
    const result = [];
    for (const [key, value] of Object.entries(map)) {
        const maxValue = value.reduce((max, current) => {
            return compare(max, current) > 0 ? max : current;
        });
        result.push(maxValue);
    }
    return result;
}

function filter(arr, conditions) {
    return arr.filter((item) => {
        for (const [key, value] of Object.entries(conditions))
            if (!item[key].includes(value)) return false;
        return true;
    });
}

function calculateBlobSHA(content) {
    return sha1(`blob ${new Blob([content]).size}\0${content}`);
}

async function asyncPool(poolLimit, array, iteratorFn) {
    const ret = [];
    const executing = [];
    for (const item of array) {
        const p = Promise.resolve().then(() => iteratorFn(item, array));
        ret.push(p);

        if (poolLimit <= array.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= poolLimit) {
                await Promise.race(executing);
            }
        }
    }
    return Promise.all(ret);
}

function combine(a, b) {
    return a.map((x, i) => ({ ...x, ...b[i] }));
}

if (typeof __DEV__ !== 'undefined') {
    var exports = (module.exports = {});
    exports.filter = filter;
}

function log(...args) {
    if (debug) console.log(...args);
}
