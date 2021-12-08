import React from "react";
import { IconLinkedin } from "hds-react";
import { useTranslation } from "next-i18next";

import ShareLinkBase from "./ShareLinkBase";
import { ShareLinkProps } from "./types";

const linkedInShareUrl = "https://linkedin.com/shareArticle";

const LinkedInShareLink = ({ sharedLink }: ShareLinkProps) => {
  const { t } = useTranslation("share_links");
  const queryParameters = { url: sharedLink };
  const linkLabel = t("linkedin");

  return (
    <ShareLinkBase
      url={linkedInShareUrl}
      queryParameters={queryParameters}
      windowName={linkLabel}
      linkLabel={linkLabel}
      icon={<IconLinkedin aria-hidden="true" />}
    />
  );
};

export default LinkedInShareLink;
