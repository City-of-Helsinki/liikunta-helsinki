import React from "react";
import { IconTwitter } from "hds-react";

import ShareLinkBase from "./ShareLinkBase";
import { ShareLinkProps } from "./types";

const twitterShareUrl = "https://twitter.com/share";

const TwitterShareLink: React.FC<ShareLinkProps> = ({ sharedLink }) => {
  const queryParameters = { url: sharedLink };
  const linkLabel = "Jaa Twitterissä";

  return (
    <ShareLinkBase
      url={twitterShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconTwitter />}
    />
  );
};

export default TwitterShareLink;
