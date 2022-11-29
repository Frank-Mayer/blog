import bibtexParse from "bibtex-parse";

export type Bibliography = {
  key: string;
  type: string;
  AUTHOR?: string;
  YEAR?: string;
  MONTH?: string;
  CHAPTER?: string;
  TITLE?: string;
  JOURNAL?: string;
  PUBLISHER?: string;
  ADDRESS?: string;
  URL?: string;
  URLTITLE?: string;
  URLDATE?: string;
  ISBN?: string;
};

const a = (href: string, innerText?: string) => {
  const url = new URL(href);
  return `<a href="${url.href}" target="_blank" rel="noopener noreferrer">${
    innerText
      ? innerText
      : url.origin + url.pathname.replace(/(?<!\/)\/(?!\/)/g, "/<wbr/>")
  }</a>`;
};

export const parseBibliography = (bibtex: string): Array<Bibliography> => {
  return bibtexParse.entries(bibtex, {
    number: "string",
  });
};

export const applyBibliographyAsync = async (
  md: string,
  bib: Array<Bibliography> | undefined | null
): Promise<string> => {
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
      "\n\n## Referenzen\n\n" +
      '<div className="cites">' +
      (
        await Promise.all(
          usedBib.map(async (id, i) => {
            const b = bib.find((entry) => entry.key === id);

            return [
              `<span id="cite-${i + 1}">[${i + 1}]</span>`,
              `<span>${await bibAutoAsync(b, id)}</span>`,
            ].join("");
          })
        )
      ).join("") +
      "</div>";
  }

  return newMd;
};

const bibAuthors = (bib: Bibliography): string => {
  if (bib.AUTHOR) {
    const authors = bib.AUTHOR.split(";")
      .map((author) => author.split(",").map((a) => a.trim()))
      .map((author) => {
        if (author.length === 2) {
          return author[1][0].toUpperCase() + ". " + author[0];
        } else {
          return author.join(" ");
        }
      });

    const authorSep = authors.length > 2 ? "; " : " und ";

    return authors.join(authorSep);
  } else {
    throw new Error(`No author found in bibliography "${bib.key}"`);
  }
};

const bibWebsiteTitleAsync = async (bib: Bibliography): Promise<string> => {
  if (bib.URLTITLE) {
    return bib.URLTITLE;
  }

  if (bib.URL) {
    const urlObj = new URL(bib.URL);

    const resp = await fetch(urlObj.origin);
    if (resp.ok) {
      const html = await resp.text();
      const titleMatch = html.match(
        /<\s*title\s*>\s*([^<]+)\s*<\s*\/\s*title\s*>/
      );
      if (titleMatch) {
        return titleMatch[1];
      }
    }

    return urlObj.hostname;
  }

  throw new Error(`No URL found in bibliography "${bib.key}"`);
};

const bibBook = (bib: Bibliography): string => {
  const str = new Array<string>();

  str.push(bibAuthors(bib), ", ");

  if (bib.TITLE) {
    if (bib.CHAPTER) {
      str.push(`"${bib.CHAPTER}" in `);
    }

    str.push(`<em>${bib.TITLE}</em>. `);
  } else {
    throw new Error(`No title found in bibliography "${bib.key}"`);
  }

  if (bib.ADDRESS) {
    str.push(` ${bib.ADDRESS}: `);
  }

  if (bib.PUBLISHER) {
    str.push(`${bib.PUBLISHER}, `);
  }

  if (bib.YEAR) {
    str.push(`${bib.YEAR}. `);
  } else {
    str.push("o.D. ");
  }

  if (bib.ISBN) {
    bib.ISBN = bib.ISBN.replace(/[-_\s]+/g, "");

    str.push(
      ` ${a(
        `https://www.isbn-suchen.de/search.php?q=${bib.ISBN}`,
        `(ISBN ${bib.ISBN})`
      )}.`
    );
  }

  return str.join("");
};

const bibOnlineAsync = async (bib: Bibliography): Promise<string> => {
  const str = new Array<string>();

  str.push(bibAuthors(bib), ". ");

  if (bib.YEAR) {
    str.push(`(${bib.YEAR}). `);
  } else {
    str.push("o.D. ");
  }

  if (bib.TITLE) {
    str.push(`&ldquo;${bib.TITLE}&rdquo; `);
  } else {
    throw new Error(`No title found in bibliography "${bib.key}"`);
  }

  if (bib.URL) {
    str.push(
      "<em>",
      await bibWebsiteTitleAsync(bib),
      "</em> [Online]. ",
      a(bib.URL),
      ". "
    );

    if (bib.URLDATE) {
      const date = new Date(bib.URLDATE);
      str.push(` (abgerufen am ${date.toLocaleDateString("de-DE")}).`);
    }
  } else {
    throw new Error(`No URL found in bibliography "${bib.key}"`);
  }

  return str.join("");
};

const bibAutoAsync = async (
  bib: Bibliography | undefined | null,
  key: string
): Promise<string> => {
  if (bib) {
    switch (bib.type.toUpperCase()) {
      case "BOOK":
        return bibBook(bib);
      case "ONLINE":
        return await bibOnlineAsync(bib);
      default:
        return key;
    }
  } else {
    return key;
  }
};
