export const mdToHtml = (md: string): string =>
  md
    .split(/[\r\n]+/g)
    .filter((line) => !line.startsWith("#"))
    .map((line) =>
      line
        .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)
        .replace(/\*\*([^*]+)\*\*/g, (_, bold) => `<b>${bold}</b>`)
        .replace(/\*([^*]+)\*/g, (_, italic) => `<i>${italic}</i>`)
        .replace(/^\*{3}.+/g, (_) => `<pre><code>`)
        .replace(/.+\*{3}$/g, (_) => `</code></pre>`)
    )
    .map((line) => `<p>${line}</p>`)
    .join("\n");
