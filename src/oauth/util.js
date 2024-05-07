function getVersion() {
    return chrome.runtime.getManifest().version;
}

function isNull(value) {
    return value === null || value === undefined;
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

function log(...args) {
    if (debug) console.log(...args);
}
