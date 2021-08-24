import { IconLinkExternal, IconLocation } from "hds-react";
import React from "react";
import { useTranslation } from "next-i18next";

import Text from "../text/Text";
import InfoBlock from "../infoBlock/InfoBlock";
import styles from "./mapBox.module.scss";

type Props = {
  title: string;
  serviceMapUrl: string;
  placeName: string;
  placeAddress: string;
  links?: React.ReactElement<React.ComponentProps<typeof InfoBlock.Link>>[];
};

function MapBox({
  title,
  serviceMapUrl,
  placeName,
  placeAddress,
  links,
}: Props) {
  const { t } = useTranslation("map_box");

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.titleText}>
          <IconLocation aria-hidden />
          <Text variant="h3">{title}</Text>
        </div>
        <a
          className={styles.mapLink}
          href={serviceMapUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("open_map")}
          <IconLinkExternal
            size="xs"
            aria-label="Avautuu uudessa välilehdessä"
          />
        </a>
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
          <InfoBlock.List key="route-directions" inline items={links} />
        )}
      </div>
    </div>
  );
}

export default MapBox;
