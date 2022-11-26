import bibtexParse from "bibtex-parse";

export type Bibliography = {
  key: string;
  type: string;
  AUTHOR?: string;
  YEAR?: string;
  MONTH?: string;
  TITLE?: string;
  JOURNAL?: string;
  PUBLISHER?: string;
  URL?: string;
  URLDATE?: string;
  ISBN?: string;
};

const a = (href: string, innerText: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer">${innerText}</a>`;

export const parseBibliography = (bibtex: string): Array<Bibliography> => {
  return bibtexParse.entries(bibtex, {
    number: "string",
  });
};

export const applyBibliography = (
  md: string,
  bib: Array<Bibliography> | undefined | null
): string => {
  if (!Array.isArray(bib)) {
    console.warn("No bibliography found");
    return md;
  }

  const usedBib = new Array<string>();

  let newMd = md.replace(/\[\^\s*([^}\n]+)\s*\]/g, (tex, id) => {
    let i = -1;
    if (usedBib.indexOf(id) === -1) {
      i = usedBib.push(id);
    } else {
      i = usedBib.indexOf(id) + 1;
    }

    return `<Link className="cite" href="#cite-${i}">&lbrack;${i}&rbrack;</Link>`;
  });

  if (usedBib.length > 0) {
    newMd =
      newMd.trim() +
      "\n\n## Einzelnachweise\n\n" +
      "<ol>\n" +
      usedBib
        .map((id, i) => {
          const b = bib.find((entry) => entry.key === id);

          if (b) {
            return (
              `<li id="cite-${i + 1}">` +
              [
                [
                  b.AUTHOR ? `${b.AUTHOR}` : "",
                  b.YEAR ? `(${b.YEAR})` : "",
                  b.TITLE ? `„${b.TITLE}“` : "",
                  b.JOURNAL ? `in ${b.JOURNAL}` : "",
                  b.PUBLISHER ? `von ${b.PUBLISHER}` : "",
                  b.ISBN
                    ? a(
                        `https://www.isbn-suchen.de/search.php?q=${b.ISBN}`,
                        `(ISBN ${b.ISBN})`
                      )
                    : "",
                ]
                  .filter(Boolean)
                  .join(" "),
                [
                  b.URL ? a(b.URL, b.URL) : "",
                  b.URLDATE
                    ? `(${new Date(b.URLDATE).toLocaleDateString("de-DE")})`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" "),
              ].join(". ") +
              "</li>"
            );
          }
          return `<li id="cite-${i + 1}">${id}</li>`;
        })
        .join("\n") +
      "\n</ol>";
  }

  return newMd;
};
