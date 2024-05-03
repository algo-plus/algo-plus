import { isNull } from './utils';
import {
    getToken,
    getHook,
    getStats,
    updateObjectDatafromPath,
    saveStats,
} from '@/common/utils/storage';
import { GitHub } from './Github';

export const uploadOneSolveProblemOnGit = async (
    bojData: any,
    cb: Function
): Promise<void> => {
    const token: any = await getToken();
    const hook: any = await getHook();
    if (isNull(token) || isNull(hook)) {
        console.error('token or hook is null', token, hook);
        return;
    }
    return upload(
        token,
        hook,
        bojData.code,
        bojData.readme,
        bojData.directory,
        bojData.fileName,
        bojData.message,
        cb
    );
};

const upload = async (
    token: string,
    hook: string,
    sourceText: string,
    readmeText: string,
    directory: string,
    filename: string,
    commitMessage: string,
    cb: Function
) => {
    const git = new GitHub(hook, token);
    const stats: any = await getStats();
    let default_branch = stats.branches[hook];
    if (isNull(default_branch)) {
        default_branch = await git.getDefaultBranchOnRepo();
        stats.branches[hook] = default_branch;
    }
    const { refSHA, ref } = await git.getReference(default_branch);
    const source = await git.createBlob(sourceText, `${directory}/${filename}`);
    const readme = await git.createBlob(readmeText, `${directory}/README.md`);
    const treeSHA = await git.createTree(refSHA, [source, readme]);
    const commitSHA = await git.createCommit(commitMessage, treeSHA, refSHA);
    await git.updateHead(ref, commitSHA);

    updateObjectDatafromPath(
        stats.submission,
        `${hook}/${source.path}`,
        source.sha
    );
    updateObjectDatafromPath(
        stats.submission,
        `${hook}/${readme.path}`,
        readme.sha
    );
    await saveStats(stats);
    if (typeof cb === 'function') {
        cb(stats.branches, directory);
    }
};
