import customGlobalPage from './global';
import customSolvingProblemPage from './solving-problem';

const url: string = window.location.pathname;

export const customSweaPage = () => {
    if (url.startsWith('/main/solvingProblem/solvingProblem.do')) {
        customSolvingProblemPage();
    }
    customGlobalPage();
};
