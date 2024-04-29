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
        return code.textContent;
    } catch (error) {
        console.error('Error fetching code:', error);
        return null;
    }
};

export { fetchCode };
