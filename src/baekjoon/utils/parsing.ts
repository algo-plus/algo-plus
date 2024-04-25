const getProblemId = (): string | null => {
    const problemIdElement = document.querySelector(
        'ul.problem-menu li a[href*="/problem"]'
    );
    if (problemIdElement && problemIdElement.textContent) {
        const match = problemIdElement.textContent.match(/(\d+)번/);
        if (match) return match[1];
    }

    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('problem_id');
    if (problemId) return problemId;

    const pathIdMatch = window.location.pathname.split('/');
    if (pathIdMatch) return pathIdMatch[pathIdMatch.length - 1];

    console.error('문제 번호 가져오기 실패!');
    return null;
};

export { getProblemId };
