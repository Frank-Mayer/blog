import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="de-DE">
      <Head>
        <link rel="shortcut icon" href="favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
