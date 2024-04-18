import customProblemPage from '@/scripts/baekjoon/problem';

const url: string = window.location.pathname;

console.info('url=', url);

if (url.startsWith('/problem/')) {
    customProblemPage();
}
