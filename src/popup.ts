const setButton: any = document.querySelector('.note_setting');
const discordIcon: any = document.querySelector('#discord-icon');
const githubIcon: any = document.querySelector('#github-icon');
setButton.addEventListener('click', function () {
    var githubLink = `chrome-extension://${chrome.runtime.id}/link.html`;
    window.open(githubLink);
});

discordIcon.addEventListener('click', function () {
    window.open('https://discord.gg/w42B5JnJBq');
});

githubIcon.addEventListener('click', function () {
    window.open('https://github.com/algo-plus');
});
