const githubButton = document.getElementById('github_button');
const localButton = document.getElementById('local_button');
const githubSetting = document.getElementById('github_setting');
const localSetting = document.getElementById('local-setting');
const githubAuth = document.getElementById('github-auth');
const repoSubmit = document.getElementById('github_link_button');

localButton.addEventListener('click', function () {
    localButton.style.backgroundColor = '#0076c0';
    localButton.style.color = 'white';
    githubButton.style.backgroundColor = 'lightgray';
    githubButton.style.color = 'gray';
    githubSetting.style.display = 'none';
    localSetting.style.display = 'block';
});

githubButton.addEventListener('click', function () {
    githubButton.style.backgroundColor = '#0076c0';
    githubButton.style.color = 'white';
    localButton.style.backgroundColor = 'lightgray';
    localButton.style.color = 'gray';
    githubSetting.style.display = 'block';
    localSetting.style.display = 'none';
});

document
    .getElementById('local-name-save')
    .addEventListener('click', function () {
        const repositoryName = document.getElementById(
            'repositoryNameInput'
        ).value;
        chrome.runtime.sendMessage({
            action: 'saveRepository',
            repositoryName: repositoryName,
        });
    });

chrome.storage.local.get('alpEnable', (data4) => {
    if (data4.alpEnable === undefined) {
        $('#onffbox').prop('checked', true);
        chrome.storage.local.set(
            { alpEnable: $('#onffbox').is(':checked') },
            () => {}
        );
    } else {
        $('#onffbox').prop('checked', data4.alpEnable);
        chrome.storage.local.set(
            { alpEnable: $('#onffbox').is(':checked') },
            () => {}
        );
    }
});

let action = false;

githubAuth.addEventListener('click', function () {
    if (action) {
        oAuth2.begin();
    }
    chrome.storage.local.get('BaekjoonHub_token', (data) => {
        const token = data.BaekjoonHub_token;
        if (token === null || token === undefined) {
            action = true;
        } else {
            const AUTHENTICATION_URL = 'https://api.github.com/user';

            const xhr = new XMLHttpRequest();
            xhr.addEventListener('readystatechange', function () {
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
                            } else {
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
        }
    });
});

repoSubmit.addEventListener('click', function () {});

const option = () => {
    return $('#type').val();
};

const repositoryName = () => {
    return $('#name').val().trim();
};

/* Status codes for creating of repo */
const statusCode = (res, status, name) => {
    switch (status) {
        case 304:
            $('#success').hide();
            $('#error').text(
                `Error creating ${name} - Unable to modify repository. Try again later!`
            );
            $('#error').show();
            break;

        case 400:
            $('#success').hide();
            $('#error').text(
                `Error creating ${name} - Bad POST request, make sure you're not overriding any existing scripts`
            );
            $('#error').show();
            break;

        case 401:
            $('#success').hide();
            $('#error').text(
                `Error creating ${name} - Unauthorized access to repo. Try again later!`
            );
            $('#error').show();
            break;

        case 403:
            $('#success').hide();
            $('#error').text(
                `Error creating ${name} - Forbidden access to repository. Try again later!`
            );
            $('#error').show();
            break;

        case 422:
            $('#success').hide();
            $('#error').text(
                `Error creating ${name} - Unprocessable Entity. Repository may have already been created. Try Linking instead (select 2nd option).`
            );
            $('#error').show();
            break;

        default:
            /* Change mode type to commit */
            chrome.storage.local.set({ mode_type: 'commit' }, () => {
                $('#error').hide();
                $('#success').html(
                    `Successfully created <a target="blank" href="${res.html_url}">${name}</a>. Start <a href="https://www.acmicpc.net/">BOJ</a>!`
                );
                $('#success').show();
                /* Show new layout */
                document.getElementById('hook_mode').style.display = 'none';
                document.getElementById('commit_mode').style.display =
                    'inherit';
            });
            /* Set Repo Hook */
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
            'This is an auto push repository for Baekjoon Online Judge created with [AlgoPlus](https://github.com/{url}).',
    };
    data = JSON.stringify(data);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4) {
            statusCode(JSON.parse(xhr.responseText), xhr.status, name);
        }
    });

    stats = {};
    stats.version = chrome.runtime.getManifest().version;
    stats.submission = {};
    chrome.storage.local.set({ stats });

    xhr.open('POST', AUTHENTICATION_URL, true);
    xhr.setRequestHeader('Authorization', `token ${token}`);
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
    xhr.send(data);
};

/* Status codes for linking of repo */
const linkStatusCode = (status, name) => {
    let bool = false;
    switch (status) {
        case 301:
            $('#success').hide();
            $('#error').html(
                `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to AlgoPlus. <br> This repository has been moved permenantly. Try creating a new one.`
            );
            $('#error').show();
            break;

        case 403:
            $('#success').hide();
            $('#error').html(
                `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to AlgoPlus. <br> Forbidden action. Please make sure you have the right access to this repository.`
            );
            $('#error').show();
            break;

        case 404:
            $('#success').hide();
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

/* 
      Method for linking hook with an existing repository 
      Steps:
      1. Check if existing repository exists and the user has write access to it.
      2. Link Hook to it (chrome Storage).
  */
const linkRepo = (token, name) => {
    const AUTHENTICATION_URL = `https://api.github.com/repos/${name}`;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4) {
            const res = JSON.parse(xhr.responseText);
            const bool = linkStatusCode(xhr.status, name);
            if (xhr.status === 200) {
                // BUG FIX
                if (!bool) {
                    // unable to gain access to repo in commit mode. Must switch to hook mode.
                    /* Set mode type to hook */
                    chrome.storage.local.set({ mode_type: 'hook' }, () => {
                        console.log(`Error linking ${name} to AlgoPlus`);
                    });
                    /* Set Repo Hook to NONE */
                    chrome.storage.local.set({ AlgoPlus_hook: null }, () => {
                        console.log('Defaulted repo hook to NONE');
                    });

                    /* Hide accordingly */
                    document.getElementById('hook_mode').style.display =
                        'inherit';
                    document.getElementById('commit_mode').style.display =
                        'none';
                } else {
                    /* Change mode type to commit */
                    /* Save repo url to chrome storage */
                    chrome.storage.local.set(
                        { mode_type: 'commit', repo: res.html_url },
                        () => {
                            $('#error').hide();
                            $('#success').html(
                                `Successfully linked <a target="blank" href="${res.html_url}">${name}</a> to AlgoPlus. Start <a href="https://www.acmicpc.net/">BOJ</a> now!`
                            );
                            $('#success').show();
                        }
                    );
                    /* Set Repo Hook */
                    stats = {};
                    stats.version = chrome.runtime.getManifest().version;
                    stats.submission = {};
                    chrome.storage.local.set({ stats });

                    chrome.storage.local.set(
                        { AlgoPlus_hook: res.full_name },
                        () => {
                            console.log('Successfully set new repo hook');
                            /* Get problems solved count */
                            chrome.storage.local.get('stats', (psolved) => {
                                const { stats } = psolved;
                            });
                        }
                    );
                    /* Hide accordingly */
                    document.getElementById('hook_mode').style.display = 'none';
                    document.getElementById('commit_mode').style.display =
                        'inherit';
                }
            }
        }
    });

    xhr.open('GET', AUTHENTICATION_URL, true);
    xhr.setRequestHeader('Authorization', `token ${token}`);
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
    xhr.send();
};

/* Check for value of select tag, Get Started disabled by default */
$('#type').on('change', function () {
    const valueSelected = this.value;
    if (valueSelected) {
        $('#github_link_button').attr('disabled', false);
    } else {
        $('#github_link_button').attr('disabled', true);
    }
});

$('#github_link_button').on('click', () => {
    /* on click should generate: 1) option 2) repository name */
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

        /* 
        Perform processing
        - step 1: Check if current stage === hook.
        - step 2: store repo name as repoName in chrome storage.
        - step 3: if (1), POST request to repoName (iff option = create new repo) ; else display error message.
        - step 4: if proceed from 3, hide hook_mode and display commit_mode (show stats e.g: files pushed/questions-solved/leaderboard)
      */
        chrome.storage.local.get('AlgoPlus_token', (data) => {
            const token = data.AlgoPlus_token;
            if (token === null || token === undefined) {
                /* Not authorized yet. */
                $('#error').text(
                    'Authorization error - Grant AlgoPlus access to your GitHub account to continue (launch extension to proceed)'
                );
                $('#error').show();
                $('#success').hide();
            } else if (option() === 'new') {
                createRepo(token, repositoryName());
            } else {
                chrome.storage.local.get('AlgoPlus_username', (data2) => {
                    const username = data2.AlgoPlus_username;
                    if (!username) {
                        /* Improper authorization. */
                        $('#error').text(
                            'Improper Authorization error - Grant AlgoPlus access to your GitHub account to continue (launch extension to proceed)'
                        );
                        $('#error').show();
                        $('#success').hide();
                    } else {
                        linkRepo(
                            token,
                            `${username}/${repositoryName()}`,
                            false
                        );
                    }
                });
            }
        });
    }

    /*프로그래밍 언어별 폴더 정리 옵션 세션 저장*/
    let org_option = $('#org_option').val();
    chrome.storage.local.set({ AlgoPlus_OrgOption: org_option }, () => {
        console.log(`Set Organize by ${org_option}`);
    });
});

/* Detect mode type */
chrome.storage.local.get('mode_type', (data) => {
    const mode = data.mode_type;

    if (mode && mode === 'commit') {
        /* Check if still access to repo */
        chrome.storage.local.get('AlgoPlus_token', (data2) => {
            const token = data2.AlgoPlus_token;
            if (token === null || token === undefined) {
                /* Not authorized yet. */
                $('#error').text(
                    'Authorization error - Grant AlgoPlus access to your GitHub account to continue (click AlgoPlus extension on the top right to proceed)'
                );
                $('#error').show();
                $('#success').hide();
                /* Hide accordingly */
                document.getElementById('hook_mode').style.display = 'inherit';
                document.getElementById('commit_mode').style.display = 'none';
            } else {
                /* Get access to repo */
                chrome.storage.local.get('AlgoPlus_hook', (repoName) => {
                    const hook = repoName.AlgoPlus_hook;
                    if (!hook) {
                        /* Not authorized yet. */
                        $('#error').text(
                            'Improper Authorization error - Grant AlgoPlus access to your GitHub account to continue (click AlgoPlus extension on the top right to proceed)'
                        );
                        $('#error').show();
                        $('#success').hide();
                        /* Hide accordingly */
                        document.getElementById('hook_mode').style.display =
                            'inherit';
                        document.getElementById('commit_mode').style.display =
                            'none';
                    } else {
                        /* Username exists, at least in storage. Confirm this */
                        linkRepo(token, hook);
                    }
                });
            }
        });
    } else {
    }
});
