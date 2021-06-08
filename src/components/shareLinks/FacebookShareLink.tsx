import React from "react";
import { IconFacebook } from "hds-react";

import ShareLinkBase from "./ShareLinkBase";
import { ShareLinkProps } from "./types";

const fbShareUrl = "https://www.facebook.com/sharer/sharer.php";

const FacebookShareLink = ({ sharedLink }: ShareLinkProps) => {
  const queryParameters = { u: sharedLink };
  const linkLabel = "Jaa Facebookissa";

  return (
    <ShareLinkBase
      url={fbShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconFacebook />}
    />
  );
};

export default FacebookShareLink;
