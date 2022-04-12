import { IconLocation } from "hds-react";
import React from "react";
import { useTranslation } from "next-i18next";

import Text from "../text/Text";
import InfoBlock from "../infoBlock/InfoBlock";
import Link from "../link/Link";
import styles from "./mapBox.module.scss";

type Props = {
  title: string;
  serviceMapUrl: string;
  placeName: string;
  placeAddress: string;
  links?: React.ReactElement<React.ComponentProps<typeof InfoBlock.Link>>[];
  accessibilitySentences?: React.ReactElement<
    React.ComponentProps<typeof InfoBlock.Collapse>
  >;
};

function MapBox({
  title,
  serviceMapUrl,
  placeName,
  placeAddress,
  links,
  accessibilitySentences,
}: Props) {
  const { t } = useTranslation("map_box");

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.titleText}>
          <IconLocation aria-hidden="true" />
          <Text variant="h3">{title}</Text>
        </div>
        <Link className={styles.mapLink} href={serviceMapUrl} target="_blank">
          {t("open_map")}
        </Link>
      </div>
      <iframe
        title={title}
        className={styles.mapContainer}
        src={serviceMapUrl}
      ></iframe>
      <div className={styles.meta}>
        <Text as="p" variant="h3">
          {placeName}
        </Text>
        <Text variant="body-l">{placeAddress}</Text>
        {links && (
          <InfoBlock.List className={styles.links} inline items={links} />
        )}
        {accessibilitySentences}
      </div>
    </div>
  );
}

export default MapBox;
