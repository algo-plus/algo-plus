import customProblemPage from '@/baekjoon/scripts/problem';
import customStatusPage from '@/baekjoon/scripts/status';
import customGlobalPage from '@/baekjoon/scripts/global';
import customSubmitPage from '@/baekjoon/scripts/submit';

const url: string = window.location.pathname;
const searchUrl: string = window.location.search;

if (
    url.startsWith('/problem/') &&
    !url.includes('status') &&
    !url.includes('history')
) {
    customProblemPage();
} else if (url.startsWith('/status') && searchUrl.includes('from_mine')) {
    customStatusPage();
} else if (url.startsWith('/submit')) {
    customSubmitPage();
}

customGlobalPage();
