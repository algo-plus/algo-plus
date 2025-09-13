export const replaceSpaceAndNewlineToHtml = (string: string): string => {
    string = string.replace(/ /g, '&nbsp;');
    return string.replace(/(\r\n|\r|\n)/g, '<br>');
};

export const trimLineByLine = (text: string): string => {
    return text
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
};

export const formatDate = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        '_' +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
};
