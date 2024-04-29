const setButton: any = document.querySelector('.note_setting');

setButton.addEventListener('click', function () {
    // GitHub 페이지로 이동하는 링크 생성
    var githubLink = `chrome-extension://${chrome.runtime.id}/link.html`;
    // 새 창에서 링크 열기
    window.open(githubLink);
});
