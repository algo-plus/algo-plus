async function fetchProblemHtml(
    problemId: string | null,
    success: (html: string) => void,
    fail: (error: any) => void
) {
    await fetch(`https://www.acmicpc.net/problem/${problemId}`)
        .then((response) => response.text())
        .then(success)
        .catch(fail);
}

export { fetchProblemHtml };
