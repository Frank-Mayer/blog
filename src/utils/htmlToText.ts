export const htmlToText = (html: string): string =>
    html
        .replace(/<\s*br\s*\/?\s*>/gi, "\n")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&nbsp;/gi, " ")
        .replace(/&quot;/gi, '"');
