import customProblemPage from '@/baekjoon/scripts/problem';
import customStatusPage from '@/baekjoon/scripts/status';
import customGlobalPage from '@/baekjoon/scripts/global';
import customSubmitPage from '@/baekjoon/scripts/submit';

const url: string = window.location.pathname;
const searchUrl: string = window.location.search;

console.info('url=', url);

if (url.startsWith('/problem/')) {
    customProblemPage();
} else if (url.startsWith('/status') && searchUrl.startsWith('?from_mine=')) {
    customStatusPage();
} else if (url.startsWith('/submit')) {
    customSubmitPage();
}

customGlobalPage();
