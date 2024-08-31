const githubButton = document.querySelector('#github-button');
const localButton = document.querySelector('#local-button');
const githubSetting = document.querySelector('#github-setting');
const localSetting = document.querySelector('#local-setting');
const githubAuth = document.querySelector('#github-auth');
const inputText = document.querySelector('#name');
const maskingCheck = document.querySelector('#masking_check');

localButton.addEventListener('click', () => {
    localButton.style.backgroundColor = '#0076c0';
    localButton.style.color = 'white';
    githubButton.style.backgroundColor = 'lightgray';
    githubButton.style.color = 'gray';
    githubSetting.style.display = 'none';
    localSetting.style.display = 'block';
});

githubButton.addEventListener('click', () => {
    githubButton.style.backgroundColor = '#0076c0';
    githubButton.style.color = 'white';
    localButton.style.backgroundColor = 'lightgray';
    localButton.style.color = 'gray';
    githubSetting.style.display = 'block';
    localSetting.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    inputText.addEventListener('input', (e) => {
        const text = e.target.value;
        maskingCheck.textContent = maskKorean(text);
    });
});
    
function maskKorean(text) {
    return 'Your new repository will be created as  '+ text.replace(/[\u3131-\u318E\uAC00-\uD7A3]+/g, '-');
}

function setPath(path){
    chrome.storage.local.set({ savePath: path }, () => {
        console.log('Path saved to local storage');
      });
}

document.querySelector('#local-name-save').addEventListener('click', () => {
    const repoName = document.querySelector('#repositoryNameInput').value;
    setPath(repoName);

    chrome.runtime.sendMessage({
        action: 'saveRepository',
        repositoryName: repoName,
        content: '1234'
    });
    window.alert('추후 업데이트 예정');
});

chrome.storage.local.get('alpEnable', (data4) => {
    if (data4.alpEnable === undefined) {
        $('#onffbox').prop('checked', true);
        chrome.storage.local.set({ alpEnable: $('#onffbox').is(':checked') });
    } else {
        $('#onffbox').prop('checked', data4.alpEnable);
        chrome.storage.local.set({ alpEnable: $('#onffbox').is(':checked') });
    }
});


githubAuth.addEventListener('click', () => {
    
    chrome.storage.local.get('AlgoPlus_token', (data) => {
        const token = data.AlgoPlus_token;
            oAuth2.begin();
            const AUTHENTICATION_URL = 'https://api.github.com/user';

            const xhr = new XMLHttpRequest();
            xhr.addEventListener('readystatechange', () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        chrome.storage.local.get('mode_type', (data2) => {
                            if (data2 && data2.mode_type === 'commit') {
                                chrome.storage.local.get(
                                    ['stats', 'AlgoPlus_hook'],
                                    (data3) => {
                                        const AlgoPlusHook =
                                            data3.AlgoPlus_hook;
                                        if (AlgoPlusHook) {
                                            $('#repo_url').html(
                                                `Your Repo: <a target="blank" style="color: cadetblue !important;" href="https://github.com/${AlgoPlusHook}">${AlgoPlusHook}</a>`
                                            );
                                        }
                                    }
                                );
                            }
                        });
                    } else if (xhr.status === 401) {
                        chrome.storage.local.set(
                            { AlgoPlus_token: null },
                            () => {
                                action = true;
                            }
                        );
                    }
                }
            });
            xhr.open('GET', AUTHENTICATION_URL, true);
            xhr.setRequestHeader('Authorization', `token ${token}`);
            xhr.send();
    });
});

chrome.storage.local.get('gitHub', (data) => {
    data.gitHub===true &&  $('#auth-success').show();
});


const option = () => {
    return $('#type').val();
};

const repositoryName = () => {
    return $('#name').val().trim();
};

const statusCode = (res, status, name) => {
    switch (status) {
        case 304:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').text(
                `Error creating ${name} - Unable to modify repository. Try again later!`
            );
            $('#error').show();
            break;

        case 400:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').text(
                `Error creating ${name} - Bad POST request, make sure you're not overriding any existing scripts`
            );
            $('#error').show();
            break;

        case 401:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').text(
                `Error creating ${name} - Unauthorized access to repo. Try again later!`
            );
            $('#error').show();
            break;

        case 403:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').text(
                `Error creating ${name} - Forbidden access to repository. Try again later!`
            );
            $('#error').show();
            break;

        case 422:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').text(
                `Error creating ${name} - Unprocessable Entity. Repository may have already been created. Try Linking instead (select 2nd option).`
            );
            $('#error').show();
            break;

        default:
            chrome.storage.local.set({ mode_type: 'commit' }, () => {
                $('#error').hide();
                $('#success').html(
                    `Successfully created <a target="blank" href="${res.html_url}">${name}</a>. Start <a href="https://www.acmicpc.net/">BOJ</a>!`
                );
                $('#success').show();
                $('#auth-success').show();
            });
            chrome.storage.local.set({ AlgoPlus_hook: res.full_name }, () => {
                console.log('Successfully set new repo hook');
            });
            break;
    }
};

const createRepo = (token, name) => {
    const AUTHENTICATION_URL = 'https://api.github.com/user/repos';
    let data = {
        name,
        private: true,
        auto_init: true,
        description:
            'This is an auto push repository for Baekjoon Online Judge created with [AlgoPlus](https://github.com/algo-plus/algo-plus).',
    };
    data = JSON.stringify(data);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4) {
            statusCode(JSON.parse(xhr.responseText), xhr.status, name);
        }
    });

    const stats = {};
    stats.version = chrome.runtime.getManifest().version;
    stats.submission = {};
    chrome.storage.local.set({ stats });

    xhr.open('POST', AUTHENTICATION_URL, true);
    xhr.setRequestHeader('Authorization', `token ${token}`);
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
    xhr.send(data);
};

const linkStatusCode = (status, name) => {
    let bool = false;
    switch (status) {
        case 301:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').html(
                `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to AlgoPlus. <br> This repository has been moved permenantly. Try creating a new one.`
            );
            $('#error').show();
            break;

        case 403:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').html(
                `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to AlgoPlus. <br> Forbidden action. Please make sure you have the right access to this repository.`
            );
            $('#error').show();
            break;

        case 404:
            $('#success').hide();
            $('#auth-success').hide();
            $('#error').html(
                `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to AlgoPlus. <br> Resource not found. Make sure you enter the right repository name.`
            );
            $('#error').show();
            break;

        default:
            bool = true;
            break;
    }
    return bool;
};

const linkRepo = (token, name) => {
    const AUTHENTICATION_URL = `https://api.github.com/repos/${name}`;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4) {
            const res = JSON.parse(xhr.responseText);
            const bool = linkStatusCode(xhr.status, name);
            if (xhr.status === 200) {
                if (!bool) {
                    chrome.storage.local.set({ mode_type: 'hook' }, () => {
                        console.log(`Error linking ${name} to AlgoPlus`);
                    });
                    chrome.storage.local.set({ AlgoPlus_hook: null }, () => {
                        console.log('Defaulted repo hook to NONE');
                    });
                } else {
                    chrome.storage.local.set(
                        { mode_type: 'commit', repo: res.html_url },
                        () => {
                            $('#error').hide();
                            $('#success').html(
                                `Successfully linked <a target="blank" href="${res.html_url}">${name}</a> to AlgoPlus. Start <a href="https://www.acmicpc.net/">BOJ</a> now!`
                            );
                            $('#auth-success').show();
                            $('#success').show();
                        }
                    );
                    stats = {};
                    stats.version = chrome.runtime.getManifest().version;
                    stats.submission = {};
                    chrome.storage.local.set({ stats });

                    chrome.storage.local.set(
                        { AlgoPlus_hook: res.full_name },
                        () => {
                            console.log('Successfully set new repo hook');
                        }
                    );
                }
            }
        }
    });

    xhr.open('GET', AUTHENTICATION_URL, true);
    xhr.setRequestHeader('Authorization', `token ${token}`);
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
    xhr.send();
};

$('#type').on('change', function () {
    const valueSelected = this.value;
    if (valueSelected) {
        $('#github-link-button').attr('disabled', false);
    } else {
        $('#github-link-button').attr('disabled', true);
    }
});

$('#github-link-button').on('click', () => {
    if (!option()) {
        $('#error').text(
            'No option selected - Pick an option from dropdown menu below that best suits you!'
        );
        $('#error').show();
    } else if (!repositoryName()) {
        $('#error').text(
            'No repository name added - Enter the name of your repository!'
        );
        $('#name').focus();
        $('#error').show();
    } else {
        $('#error').hide();
        $('#success').text('Attempting to create Hook... Please wait.');
        $('#success').show();
        $('#auth-success').show();

        chrome.storage.local.get('AlgoPlus_token', (data) => {
            const token = data.AlgoPlus_token;
            if (token === null || token === undefined) {
                $('#error').text(
                    'Authorization error - Grant AlgoPlus access to your GitHub account to continue (launch extension to proceed)'
                );
                $('#error').show();
                $('#success').hide();
                $('#auth-success').hide();
            } else if (option() === 'new') {
                createRepo(token, repositoryName());
            } else {
                chrome.storage.local.get('AlgoPlus_username', (data2) => {
                    const username = data2.AlgoPlus_username;
                    if (!username) {
                        $('#error').text(
                            'Improper Authorization error - Grant AlgoPlus access to your GitHub account to continue (launch extension to proceed)'
                        );
                        $('#error').show();
                        $('#success').hide();
                        $('#auth-success').hide();
                    } else {
                        linkRepo(token, `${username}/${repositoryName()}`);
                    }
                });
            }
        });
    }

    let org_option = $('#org_option').val();
    chrome.storage.local.set({ AlgoPlus_OrgOption: org_option }, () => {
        console.log(`Set Organize by ${org_option}`);
    });
});

chrome.storage.local.get('mode_type', (data) => {
    const mode = data.mode_type;

    if (mode && mode === 'commit') {
        chrome.storage.local.get('AlgoPlus_token', (data2) => {
            const token = data2.AlgoPlus_token;
            if (token === null || token === undefined) {
                $('#error').text(
                    'Authorization error - Grant AlgoPlus access to your GitHub account to continue (click AlgoPlus extension on the top right to proceed)'
                );
                $('#error').show();
                $('#success').hide();
                $('#auth-success').hide();
            } else {
                chrome.storage.local.get('AlgoPlus_hook', (repoName) => {
                    const hook = repoName.AlgoPlus_hook;
                    if (!hook) {
                        $('#error').text(
                            'Improper Authorization error - Grant AlgoPlus access to your GitHub account to continue (click AlgoPlus extension on the top right to proceed)'
                        );
                        $('#error').show();
                        $('#success').hide();
                        $('#auth-success').hide();
                    } else {
                        linkRepo(token, hook);
                    }
                });
            }
        });
    }
});
