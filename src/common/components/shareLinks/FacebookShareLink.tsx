import React from "react";
import { IconFacebook } from "hds-react";
import { useTranslation } from "next-i18next";

import ShareLinkBase from "./ShareLinkBase";
import { ShareLinkProps } from "./types";

const fbShareUrl = "https://www.facebook.com/sharer/sharer.php";

const FacebookShareLink = ({ sharedLink }: ShareLinkProps) => {
  const { t } = useTranslation("share_links");
  const queryParameters = { u: sharedLink };
  const linkLabel = t("facebook");

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
