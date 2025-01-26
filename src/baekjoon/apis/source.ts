import { CodeProps } from '@/baekjoon/types/source';

function parseLang(str: string) {
    const parsed = str.slice(7, str.length);
    if (parsed === 'c++src') return 'cpp';
    else if (parsed === 'csrc') return 'c';
    return parsed;
}

const fetchCode = async (submitId: number) => {
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
        const codeProp: CodeProps = {
            lang: parseLang(lang),
            code: code.textContent,
        };
        return codeProp;
    } catch (error) {
        console.error('Error fetching code:', error);
        return null;
    }
};

export { fetchCode };
