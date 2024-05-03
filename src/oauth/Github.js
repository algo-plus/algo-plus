class GitHub {
    constructor(hook, token) {
        this.update(hook, token);
    }

    update(hook, token) {
        this.hook = hook;
        this.token = token;
    }

    async getReference(branch = 'main') {
        return getReference(this.hook, this.token, branch);
    }

    async getDefaultBranchOnRepo() {
        return getDefaultBranchOnRepo(this.hook, this.token);
    }

    async createBlob(content, path) {
        return createBlob(this.hook, this.token, content, path);
    }

    async createTree(refSHA, tree_items) {
        return createTree(this.hook, this.token, refSHA, tree_items);
    }

    async createCommit(message, treeSHA, refSHA) {
        return createCommit(this.hook, this.token, message, treeSHA, refSHA);
    }

    async updateHead(ref, commitSHA) {
        log('GitHub updateHead', 'ref:', ref, 'commitSHA:', commitSHA);
        return updateHead(this.hook, this.token, ref, commitSHA, true);
    }

    async getTree() {
        return getTree(this.hook, this.token);
    }
}

async function getDefaultBranchOnRepo(hook, token) {
    return fetch(`https://api.github.com/repos/${hook}`, {
        method: 'GET',
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            return data.default_branch;
        });
}

async function getReference(hook, token, branch = 'main') {
    return fetch(
        `https://api.github.com/repos/${hook}/git/refs/heads/${branch}`,
        {
            method: 'GET',
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            return { refSHA: data.object.sha, ref: data.ref };
        });
}

async function createBlob(hook, token, content, path) {
    return fetch(`https://api.github.com/repos/${hook}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({
            content: b64EncodeUnicode(content),
            encoding: 'base64',
        }),
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'content-type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            return { path, sha: data.sha, mode: '100644', type: 'blob' };
        });
}

async function createTree(hook, token, refSHA, tree_items) {
    return fetch(`https://api.github.com/repos/${hook}/git/trees`, {
        method: 'POST',
        body: JSON.stringify({ tree: tree_items, base_tree: refSHA }),
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'content-type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            return data.sha;
        });
}

async function createCommit(hook, token, message, treeSHA, refSHA) {
    return fetch(`https://api.github.com/repos/${hook}/git/commits`, {
        method: 'POST',
        body: JSON.stringify({ message, tree: treeSHA, parents: [refSHA] }),
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'content-type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            return data.sha;
        });
}

async function updateHead(hook, token, ref, commitSHA, force = true) {
    return fetch(`https://api.github.com/repos/${hook}/git/${ref}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commitSHA, force }),
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'content-type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            return data.sha;
        });
}

async function getTree(hook, token) {
    return fetch(
        `https://api.github.com/repos/${hook}/git/trees/HEAD?recursive=1`,
        {
            method: 'GET',
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    )
        .then((res) => res.json())
        .then((data) => {
            return data.tree;
        });
}
