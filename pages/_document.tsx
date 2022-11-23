import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="de-DE">
      <Head>
        <link rel="shortcut icon" href="favicon.svg" type="image/svg+xml" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1590375905385922"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
