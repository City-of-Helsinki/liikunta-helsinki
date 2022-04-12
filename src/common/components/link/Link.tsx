import React from "react";
import { Link as HDSLink, LinkProps as HDSLinkProps } from "hds-react";
import { useTranslation } from "next-i18next";

import AppConfig from "../../../domain/app/AppConfig";
import getIsValidUrl from "../../utils/getIsValidUrl";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  children: HDSLinkProps["children"];
  disableVisitedStyles?: HDSLinkProps["disableVisitedStyles"];
};

const Link = React.forwardRef<HTMLAnchorElement, Props>(
  ({ href, target, ...delegatedProps }, ref) => {
    const { t } = useTranslation("link");

    const isOpenInNewTab = target === "_blank";
    const isExternal = getIsHrefExternal(href);

    return (
      // Apply ref directly to HDSLink once it supports it
      <span ref={ref}>
        <HDSLink
          {...delegatedProps}
          href={href}
          openInNewTab={isOpenInNewTab}
          external={isExternal}
          size="M"
          openInExternalDomainAriaLabel={t(
            "open_in_external_domain_aria_label"
          )}
          openInNewTabAriaLabel={t("open_in_new_tab_aria_label")}
        />
      </span>
    );
  }
);

Link.displayName = "Link";

export default Link;

function getIsHrefExternal(href: string): boolean {
  if (getIsValidUrl(href)) {
    const appOrigin = new URL(AppConfig.nextApiGraphqlEndpoint).origin;
    const hrefOrigin = new URL(href).origin;

    return appOrigin !== hrefOrigin;
  }

  // If href is not a valid url, assume that it is not external. When href is
  // not a valid url, it can be:
  // a relative path: /fi/article-title
  // a have unsupported protocol: weirdProtocol://domain.fi/fi/article-title
  // be otherwise malformed: https:|/domain.fi/fi/article-title
  return false;
}
