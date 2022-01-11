import React, { useState } from "react";
import { useTranslation } from "next-i18next";

import styles from "./ellipsedTextWithToggle.module.scss";

type Props = {
  lines: string[];
};

export default function EllipsedTextWithToggle({ lines }: Props) {
  const { t } = useTranslation("venue_page");
  const [open, setOpen] = useState<boolean>(false);

  const firstLines = lines.slice(0, 3).join("\n");
  const restOfLines = lines.slice(3).join("\n");

  return (
    <span className={styles.container}>
      {firstLines}
      {"\n"}
      {open && restOfLines}
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          setOpen((prevOpen) => !prevOpen);
        }}
      >
        {!open ? t("show_long_price") : t("hide_long_price")}
      </button>
    </span>
  );
}
