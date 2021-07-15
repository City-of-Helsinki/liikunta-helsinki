import React, { useMemo } from "react";
import createDOMPurify from "dompurify";
import parse, { domToReact } from "html-react-parser";
import { Element } from "domhandler/lib/node";

import Text from "../text/Text";

function getIsomorphicDOMPurifier() {
  if (!process.browser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const { JSDOM } = require("jsdom");
    const window = new JSDOM("").window;

    return createDOMPurify(window);
  }

  return createDOMPurify();
}

type Props = {
  children: string;
  components?: {
    p?: React.ComponentType<{ children: React.ReactNode }>;
  };
};

const DefaultP = ({ children }: { children: React.ReactNode }) => (
  <Text variant="body">{children}</Text>
);

export default function HtmlToReact({
  children: dirty,
  components: { p: P = DefaultP } = {},
}: Props) {
  const clean = useMemo(
    () =>
      getIsomorphicDOMPurifier().sanitize(dirty, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: ["b", "q", "p"],
      }),
    [dirty]
  );

  return (
    <>
      {parse(clean, {
        replace: (domNode) => {
          if (domNode instanceof Element && domNode.name === "p") {
            return <P>{domToReact(domNode.children)}</P>;
          }

          return domNode;
        },
      })}
    </>
  );
}