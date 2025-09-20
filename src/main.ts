import { customBaekjoonPage } from '@/baekjoon/scripts/main';
import { customSweaPage } from '@/swea/scripts/main';

const href: string = location.href;

if (href.includes('acmicpc.net') || href.includes('boj.kr')) {
    customBaekjoonPage();
} else if (href.includes('swexpertacademy.com')) {
    customSweaPage();
}
