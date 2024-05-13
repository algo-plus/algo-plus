import { isNull } from './utils';
import {
    getToken,
    getHook,
    getStats,
    updateObjectDatafromPath,
    saveStats,
} from '@/common/utils/storage';
import { GitHub } from './github';
import { clearReviewCode } from './storage/review';

export const uploadOneSolveProblemOnGit = async (
    bojData: any,
    content: string,
    cb: Function
): Promise<void> => {
    const token: any = await getToken();
    const hook: any = await getHook();
    if (isNull(token) || isNull(hook)) {
        console.error('token or hook is null', token, hook);
        return;
    }
    await clearReviewCode();
    return upload(
        token,
        hook,
        bojData.readme + `\n\n` + content,
        bojData.directory,
        bojData.message,
        cb
    );
};

const upload = async (
    token: string,
    hook: string,
    readmeText: string,
    directory: string,
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
    const readme = await git.createBlob(readmeText, `${directory}/README.md`);
    const treeSHA = await git.createTree(refSHA, [readme]);
    const commitSHA = await git.createCommit(commitMessage, treeSHA, refSHA);
    await git.updateHead(ref, commitSHA);
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
