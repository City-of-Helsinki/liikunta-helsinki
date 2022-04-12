import React from "react";
import { Link as HDSLink, LinkProps as HDSLinkProps } from "hds-react";
import { useTranslation } from "next-i18next";

import getIsHrefExternal from "../../utils/getIsHrefExternal";

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
