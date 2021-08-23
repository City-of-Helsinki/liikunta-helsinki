import React from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "@monsonjeremy/react-leaflet";
import "leaflet/dist/leaflet.css";

import venueIcon from "./VenueIcon";
import Text from "../text/Text";
import styles from "./mapView.module.scss";
import { MapItem } from "../../types";
import {
  BOUNDARIES,
  DEFAULT_POSITION,
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_URL,
} from "./mapConstants";

type Props = {
  items: MapItem[];
};

function MapView({ items = [] }: Props) {
  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={DEFAULT_ZOOM}
      className={styles.mapView}
      maxBounds={BOUNDARIES}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
    >
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url={TILE_URL}
      />
      {items?.map((item) => {
        if (!item.location) {
          return null;
        }

        return (
          <Marker
            key={item.id}
            position={[item.location[1], item.location[0]]}
            icon={venueIcon}
          >
            <Popup className={styles.popup}>
              <Text variant="body">{item.title}</Text>
              <Link href={item.href}>Näytä sivu</Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;
