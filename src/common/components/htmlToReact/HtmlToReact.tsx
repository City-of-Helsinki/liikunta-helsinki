import React, { useMemo } from "react";
import createDOMPurify from "dompurify";
import parse, { domToReact } from "html-react-parser";
import { Element } from "domhandler/lib/node";

import Text from "../text/Text";

function getIsomorphicDOMPurifier() {
  if (!process.browser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const { JSDOM } = require("jsdom");
    const { window } = new JSDOM("");

    return createDOMPurify(window);
  }

  return createDOMPurify();
}

type Props = {
  children: string;
  components?: {
    p?: React.ComponentType<{ children: React.ReactNode }>;
    h2?: React.ComponentType<{ children: React.ReactNode }>;
  };
};

const DefaultP = ({ children }: { children: React.ReactNode }) => (
  <Text variant="body">{children}</Text>
);

const DefaultH2 = ({ children }: { children: React.ReactNode }) => (
  <Text variant="h2">{children}</Text>
);

export default function HtmlToReact({
  children: dirty,
  components,
  components: { p: P = DefaultP, h2: H2 = DefaultH2 } = {},
}: Props) {
  const clean = useMemo(
    () =>
      getIsomorphicDOMPurifier().sanitize(dirty, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: ["b", "q", "p", "h2"],
      }),
    [dirty]
  );

  return (
    <>
      {parse(clean, {
        replace: (domNode) => {
          if ("attribs" in domNode && domNode.name === "p") {
            return <P>{domToReact(domNode.children)}</P>;
          }

          if ("attribs" in domNode && domNode.name === "h2") {
            return <H2>{domToReact(domNode.children)}</H2>;
          }

          return domNode;
        },
      })}
    </>
  );
}
