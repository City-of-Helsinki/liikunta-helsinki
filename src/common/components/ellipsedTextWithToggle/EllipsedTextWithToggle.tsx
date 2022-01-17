import React from "react";
import { useTranslation } from "next-i18next";
import { useAccordion } from "hds-react";

import styles from "./ellipsedTextWithToggle.module.scss";

type Props = {
  lines: string[];
};

export default function EllipsedTextWithToggle({ lines }: Props) {
  const { t } = useTranslation("venue_page");
  const { isOpen, buttonProps, contentProps } = useAccordion({
    initiallyOpen: false,
  });

  const firstLines = lines.slice(0, 3).join("\n");
  const restOfLines = lines.slice(3).join("\n");

  return (
    <span className={styles.container}>
      {firstLines}
      {"\n"}
      {isOpen && (
        <div aria-hidden={!isOpen} {...contentProps}>
          {restOfLines}
        </div>
      )}
      <button {...buttonProps} type="button" className={styles.button}>
        {!isOpen ? t("show_long_price") : t("hide_long_price")}
      </button>
    </span>
  );
}
