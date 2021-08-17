import Document, { Html, Head, Main, NextScript } from "next/document";
import { resetIdCounter } from "downshift";

class LiikuntDocument extends Document {
  static async getInitialProps(ctx) {
    // Reset downshift id counter so that it won't be incremented between static
    // and client renders.
    resetIdCounter();
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head />
        {/* HDS embeds styles into the head of the document. Hence for HDS */}
        {/* styles to be applied, the document object must be available. */}
        {/* The document object is not available during server side renders. */}
        {/* Circumventing this issue is too difficult and means too many */}
        {/* compromises. Hence we are just hiding the content of the page */}
        {/* until the first client side render, at which time the document */}
        {/* object is available. */}
        {/* TODO: Remove this hackfix to ensure that pre-rendered pages' */}
        {/*       SEO performance is not impacted. */}
        <body style={{ visibility: "hidden" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default LiikuntDocument;
