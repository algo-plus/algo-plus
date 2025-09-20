import customProblemPage from './problem';
import customStatusPage from './status';
import customGlobalPage from './global';
import customSubmitPage from './submit';

const url: string = window.location.pathname;
const searchUrl: string = window.location.search;

export const customBaekjoonPage = () => {
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
};
