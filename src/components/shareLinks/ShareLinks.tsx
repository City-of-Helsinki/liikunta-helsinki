import React from "react";
import { IconLink } from "hds-react";
import { useTranslation } from "next-i18next";

import CopyButton from "../copyButton/CopyButton";
import FacebookShareLink from "./FacebookShareLink";
import LinkedInShareLink from "./LinkedInShareLink";
import styles from "./shareLinks.module.scss";
import TwitterShareLink from "./TwitterShareLink";

const ShareLinks = () => {
  const { t } = useTranslation("share_links");
  // We are using the client only accessible href. By doing this, we do not need
  // to pass the original request from the server. This same pattern was used in
  // MyHelsinki. Limitation is that sharing buttons will be re-rendered on client
  // side because href value is different
  const href = process.browser
    ? `${window.location.origin}${window.location.pathname}`
    : "";

  return (
    <ul className={styles.linkList}>
      <li className={styles.relative}>
        <CopyButton
          type="button"
          string={href}
          successClass={styles.copyButtonSuccess}
          successMessage={
            <span className={styles.successTooltip}>{t("copy.success")}</span>
          }
          aria-label={t("copy.label")}
          title={t("copy.label")}
        >
          <IconLink />
        </CopyButton>
      </li>
      <li>
        <FacebookShareLink sharedLink={href} />
      </li>
      <li>
        <TwitterShareLink sharedLink={href} />
      </li>
      <li>
        <LinkedInShareLink sharedLink={href} />
      </li>
    </ul>
  );
};

export default ShareLinks;
