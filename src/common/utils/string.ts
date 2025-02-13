export const replaceNewLineToBrTag = (string: string): string => {
    return string.replace(/(\r\n|\r|\n)/g, '<br>');
};

export const trimLineByLine = (text: string): string => {
    return text
        .split('\n')
        .map((line) => line.trim())
        .join('\n');
};
