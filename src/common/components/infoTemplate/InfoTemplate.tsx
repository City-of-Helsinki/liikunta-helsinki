import React from "react";

import Text from "../text/Text";
import styles from "./infoTemplate.module.scss";

type Props = {
  title: string;
  description: string;
  icon?: React.ComponentType<{
    size?: string;
  }>;
};

const InfoTemplate = ({ title, description, icon: Icon }: Props) => {
  return (
    <div className={styles.infoTemplateContainer}>
      <div className={styles.infoTemplate}>
        {Icon && (
          <span className={styles.infoTemplateIcon}>
            <Icon size="xl" aria-hidden="true" />
          </span>
        )}
        <Text variant="h2">{title}</Text>
        <Text variant="body-l">{description}</Text>
      </div>
    </div>
  );
};

export default InfoTemplate;
