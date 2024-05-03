export const replaceNewLineToBrTag = (string: string): string => {
    return string.replace(/(\r\n|\r|\n)/g, '<br>');
};
