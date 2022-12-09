import "../styles/index.scss";
import type { AppProps } from "next/app";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Head from "next/head";

const variants = {
  hidden: { opacity: 0, x: 100, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -100, y: 0 },
};

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta httpEquiv="language" content="de" />
        <meta name="author" content="Frank Mayer" />
      </Head>

      <Header />

      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <motion.main
          key={router.pathname}
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
          transition={{ type: "linear", duration: 0.5 }}
        >
          <Component {...pageProps} />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default App;
