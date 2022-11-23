export const mdSupercharge = (md: string): string =>
  md.replace(
    /```([a-z]+)\r?\n([^`]+)\r?\n```/gi,
    (_, lang, code) =>
      `<SyntaxHighlighting language="${lang}">{` +
      JSON.stringify(code) +
      "}</SyntaxHighlighting>"
  );
