import PrismAsync from "react-syntax-highlighter/dist/cjs/prism-async";
import darcula from "react-syntax-highlighter/dist/cjs/styles/prism/darcula";

type Props = {
  language: string;
  children: string;
};

const backgroundColor = darcula['pre[class*="language-"]'].background;

darcula[
  'pre[class*="language-"]'
].boxShadow = `50vw 0 ${backgroundColor}, -50vw 0 ${backgroundColor}`;

export const SyntaxHighlighting = (props: Props) => (
  <PrismAsync
    language={props.language}
    showLineNumbers
    style={{
      ...darcula,
    }}
  >
    {props.children.trim()}
  </PrismAsync>
);
