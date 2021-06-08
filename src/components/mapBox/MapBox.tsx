import { IconLinkExternal, IconLocation } from "hds-react";
import React from "react";

import Text from "../text/Text";
import InfoBlock from "../infoBlock/InfoBlock";
import styles from "./mapBox.module.scss";

type Props = {
  title: string;
  serviceMapUrl: string;
  placeName: string;
  placeAddress: string;
};

const MapBox = ({ title, serviceMapUrl, placeName, placeAddress }: Props) => {
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
          Avaa kartta
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
        <InfoBlock.List
          id="route-directions"
          inline
          items={[
            <InfoBlock.Link
              external
              id="google"
              href="#"
              label="Reittiohjeet (Google)"
            />,
            <InfoBlock.Link
              external
              id="hsl"
              href="#"
              label="Reittiohjeet (HSL)"
            />,
          ]}
        />
      </div>
    </div>
  );
};

export default MapBox;
