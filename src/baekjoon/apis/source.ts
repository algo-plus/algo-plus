import { SourceCode } from '@/common/types/source';

function parseLang(str: string) {
    const parsed = str.slice(7, str.length);
    if (parsed === 'c++src') return 'cpp';
    else if (parsed === 'csrc') return 'c';
    return parsed;
}

const fetchCode = async (submitId: number | string) => {
    const url = `https://www.acmicpc.net/source/${submitId}`;
    try {
        const res = await fetch(url);
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const code = doc.querySelector('.no-mathjax.codemirror-textarea');
        if (!code) {
            console.error('No code found');
            return null;
        }
        const lang = code.getAttribute('data-mime');
        if (!lang) {
            console.error('No lang found');
            return null;
        }
        const SourceCode: SourceCode = {
            lang: parseLang(lang),
            code: code.textContent,
        };
        return SourceCode;
    } catch (error) {
        console.error('Error fetching code:', error);
        return null;
    }
};

export { fetchCode };
