import React from "react";

import Text from "../text/Text";
import styles from "./section.module.scss";

type Props = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: Props) {
  return (
    <section className={styles.section}>
      <Text variant="h2" className={styles.title}>
        {title}
      </Text>
      {children}
    </section>
  );
}

export default Section;
