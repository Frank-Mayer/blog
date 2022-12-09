import { Converter } from "showdown";

const converter = new Converter({
  tables: true,
  noHeaderId: true,
  ghCodeBlocks: true,
});

export const mdToHtmlPreview = (md: string): string => {
  const html = converter.makeHtml(
    md
      .trim()
      .split(/\r?\n/g)
      .filter((line) => !line.startsWith("#"))
      .map((line) => line.replace(/\[\^\s*([^}\n]+)\s*\]/g, ""))
      .slice(0, 3)
      .map((line) => `<p>${line}</p>`)
      .join("\n")
  );

  console.debug("mdToHtmlPreview", html);

  return html;
};
