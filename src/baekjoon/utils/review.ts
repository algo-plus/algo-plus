import * as Diff from 'diff';

const markdownCodeDiff = (oldCode: string, newCode: string) => {
    let codeDiffContainer = '```diff\n';
    const diff = Diff.diffLines(oldCode, newCode);
    const diffBlock = diff.map((part) => {
        if (part.added) {
            let addedLines = part.value.split('\n').map((part) => {
                return '+' + part + '\n';
            });
            addedLines.pop();
            return addedLines.join('');
        }
        if (part.removed) {
            let removedLines = part.value.split('\n').map((part) => {
                return '-' + part + '\n';
            });
            removedLines.pop();
            return removedLines.join('');
        }
        return part.value;
    });
    const diffBlockMake = diffBlock.join('');
    codeDiffContainer += diffBlockMake;
    codeDiffContainer += '\n```';
    return codeDiffContainer;
};

const markdownCommentBlock = (commentBlocks: CommentBlocks) => {
    let commentBlockContainer = '\n\n# 💻 코드 리뷰\n\n';
    let idx = 1;
    if (
        commentBlocks.length === 1 &&
        commentBlocks[0].comment === '' &&
        !commentBlocks[0].isRegistered
    ) {
        return '';
    }
    commentBlocks.forEach((commentBlock) => {
        commentBlockContainer += '\n\n\n## 🎯 ' + idx++ + '번 코드\n';

        if (commentBlock.selectedOldCode) {
            commentBlockContainer += '### 🌗 이전코드: \n\n';
            commentBlockContainer +=
                '```\n' + commentBlock.selectedOldCode + '\n```\n';
        }
        if (commentBlock.selectedNewCode) {
            commentBlockContainer += '### 🌖 바뀐코드: \n\n';
            commentBlockContainer +=
                '```\n' + commentBlock.selectedNewCode + '\n```\n';
        }
        if (commentBlock.comment) {
            commentBlockContainer += '\n### 📄 코멘트: \n\n\n\n';
            commentBlockContainer += commentBlock.comment;
        }
    });
    return commentBlockContainer;
};

const markdownReview = (reviewMarkdownContent: ReviewMarkdownContent) => {
    const title = '#  🚀  오답노트 \n\n';
    const diffViewer = markdownCodeDiff(
        reviewMarkdownContent.oldCode || '',
        reviewMarkdownContent.newCode || ''
    );
    let commentBlock = '';
    if (reviewMarkdownContent.commentBlocks) {
        commentBlock = markdownCommentBlock(
            reviewMarkdownContent.commentBlocks
        );
    }
    const lastComment =
        '\n\n\n ## 🏆 전체 코멘트 \n\n' + (reviewMarkdownContent.comment || '');
    const reviewContainer = title + diffViewer + commentBlock + lastComment;
    return reviewContainer;
};

export { markdownReview };
