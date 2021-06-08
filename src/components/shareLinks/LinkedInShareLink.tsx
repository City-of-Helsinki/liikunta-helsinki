import React from "react";
import { IconLinkedin } from "hds-react";

import ShareLinkBase from "./ShareLinkBase";
import { ShareLinkProps } from "./types";

const linkedInShareUrl = "https://linkedin.com/shareArticle";

const LinkedInShareLink = ({ sharedLink }: ShareLinkProps) => {
  const queryParameters = { url: sharedLink };
  const linkLabel = "Jaa LinkedInissä";

  return (
    <ShareLinkBase
      url={linkedInShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconLinkedin />}
    />
  );
};

export default LinkedInShareLink;
