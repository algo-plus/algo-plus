getVersion = () => {
    return chrome.runtime.getManifest().version;
};

elementExists = (element) => {
    return (
        element !== undefined &&
        element !== null &&
        element.hasOwnProperty('length') &&
        element.length > 0
    );
};

isNull = (value) => {
    return value === null || value === undefined;
};

isEmpty = (value) => {
    return (
        isNull(value) || (value.hasOwnProperty('length') && value.length === 0)
    );
};

isNotEmpty = (obj) => {
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

escapeHtml = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (m) => {
        return map[m];
    });
};

String.prototype.escapeHtml = () => {
    return escapeHtml(this);
};

unescapeHtml = (text) => {
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
};

String.prototype.unescapeHtml = function () {
    return unescapeHtml(this);
};

/** 배열 내의 key에 val 값을 포함하고 있는 요소만을 반환합니다.
 * @param {array} arr - array to be filtered
 * @param {object} conditions - object of key, values to be used in filter
 * @returns {array} - filtered array
 */
function filter(arr, conditions) {
    return arr.filter((item) => {
        for (const [key, value] of Object.entries(conditions))
            if (!item[key].includes(value)) return false;
        return true;
    });
}

if (typeof __DEV__ !== 'undefined') {
    var exports = (module.exports = {});
    exports.filter = filter;
}
