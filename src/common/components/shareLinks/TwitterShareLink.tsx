import React from "react";
import { IconTwitter } from "hds-react";
import { useTranslation } from "next-i18next";

import ShareLinkBase from "./ShareLinkBase";
import { ShareLinkProps } from "./types";

const twitterShareUrl = "https://twitter.com/share";

const TwitterShareLink = ({ sharedLink }: ShareLinkProps) => {
  const { t } = useTranslation("share_links");
  const queryParameters = { url: sharedLink };
  const linkLabel = t("twitter");

  return (
    <ShareLinkBase
      url={twitterShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconTwitter aria-hidden="true" />}
    />
  );
};

export default TwitterShareLink;
