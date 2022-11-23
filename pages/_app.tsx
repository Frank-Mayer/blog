import "../styles/index.scss";
import type { AppProps } from "next/app";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Header />

    <main>
      <Component {...pageProps} />
    </main>

    <Footer />
  </>
);

export default App;
