import customProblemPage from '@/scripts/baekjoon/problem';
import customStatusPage from '@/scripts/baekjoon/status';
import customSubmitPage from '@/scripts/baekjoon/submit';

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
