import { SourceCode } from '@/common/types/review-note';
import { SweaCodeMeta } from '@/swea/types/source';

const parsingPopCodeParams = (onclickString: string) => {
    const match = onclickString.match(/pop_code\(([^)]*)\)/);
    if (!match) return null;
    return Array.from(match[1].matchAll(/'([^']*)'/g), (m) => m[1]);
};

const fetchCode = async ({
    contestProbId,
    contestHistoryId,
    submitIndex,
}: SweaCodeMeta) => {
    const url = `https://swexpertacademy.com/main/solvingProblem/submitCodePopup.do?contestProbId=${contestProbId}&contestHistoryId=${contestHistoryId}&submitIndex=${submitIndex}`;
    try {
        const res = await fetch(url);
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const code = doc.querySelector('#textSource');
        if (!code) {
            console.error('No code found');
            return null;
        }
        const SourceCode: SourceCode = {
            code: code.textContent,
        };
        return SourceCode;
    } catch (error) {
        console.error('Error fetching code:', error);
        return null;
    }
};

const isSameCode = (codeMeta1: SweaCodeMeta, codeMeta2: SweaCodeMeta) => {
    return (
        codeMeta1.contestProbId === codeMeta2.contestProbId &&
        codeMeta1.contestHistoryId === codeMeta2.contestHistoryId &&
        codeMeta1.submitIndex === codeMeta2.submitIndex
    );
};

export { parsingPopCodeParams, fetchCode, isSameCode };
