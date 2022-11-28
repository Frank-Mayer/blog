export const mdSupercharge = (md: string): string => {
  let tex = false;

  const mdSupercharged = md
    .replace(
      /```([a-z]+)\r?\n([^`]+)\r?\n```/gi,
      (_, lang, code) =>
        `<SyntaxHighlighting language="${lang}">{` +
        JSON.stringify(code) +
        "}</SyntaxHighlighting>"
    )
    .replace(/[\r\n]{2,}\$([^\$\r\n]+)\$[\r\n]{2,}/g, (_, math) => {
      tex = true;
      return `<tex-math>{${JSON.stringify(math)}}</tex-math>`;
    })
    .replace(/\$([^\$\r\n]+)\$/g, (_, math) => {
      tex = true;
      return `<i-math>{${JSON.stringify(math)}}</i-math>`;
    });

  return tex
    ? mdSupercharged +
        '<script defer async src="https://cdn.jsdelivr.net/npm/tex-math@1.3.3/dist/tex-math.js"></script>'
    : mdSupercharged;
};
