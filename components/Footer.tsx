import Link from "next/link";

export const Footer = () => (
  <footer>
    <h2 className="footer-title">Über</h2>
    <Link href="https://www.frank-mayer.io">Meine Webseite</Link>
    <Link href="https://github.com/Frank-Mayer/blog">
      Dieser Blog ist Open Source
    </Link>
  </footer>
);
