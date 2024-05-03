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

const markdownCommentBlock = () => {

}

const markdownReview = (reviewMarkdownContent: ReviewMarkdownContent) => {
  const title = "# 오답노트 \n"
  const diffViewer = markdownCodeDiff(reviewMarkdownContent.oldCode || '', reviewMarkdownContent.newCode || '');

}

export { markdownReview};
