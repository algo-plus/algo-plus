export const b64EncodeUnicode = (str: string): string => {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (p1) {
            return String.fromCharCode(parseInt(`0x${p1}`, 16));
        })
    );
};

export class GitHub {
    hook = '';
    token = '';

    constructor(hook: string, token: string) {
        this.update(hook, token);
    }

    update(hook: string, token: string) {
        this.hook = hook;
        this.token = token;
    }

    async getReference(branch = 'main') {
        return getReference(this.hook, this.token, branch);
    }

    async getDefaultBranchOnRepo() {
        return getDefaultBranchOnRepo(this.hook, this.token);
    }

    async createBlob(content: string, path: string) {
        return createBlob(this.hook, this.token, content, path);
    }

    async createTree(refSHA: string, tree_items: object) {
        return createTree(this.hook, this.token, refSHA, tree_items);
    }

    async createCommit(message: string, treeSHA: string, refSHA: string) {
        return createCommit(this.hook, this.token, message, treeSHA, refSHA);
    }

    async updateHead(ref: string, commitSHA: string) {
        return updateHead(this.hook, this.token, ref, commitSHA, true);
    }

    async getTree() {
        return getTree(this.hook, this.token);
    }
}

async function getDefaultBranchOnRepo(
    hook: string,
    token: string
): Promise<any> {
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

async function getReference(
    hook: string,
    token: string,
    branch = 'main'
): Promise<any> {
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
async function createBlob(
    hook: string,
    token: string,
    content: string,
    path: string
): Promise<any> {
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

async function createTree(
    hook: string,
    token: string,
    refSHA: string,
    tree_items: object
): Promise<any> {
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

async function createCommit(
    hook: string,
    token: string,
    message: string,
    treeSHA: string,
    refSHA: string
): Promise<any> {
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

async function updateHead(
    hook: string,
    token: string,
    ref: string,
    commitSHA: string,
    force = true
): Promise<any> {
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

async function getTree(hook: string, token: string): Promise<any> {
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
