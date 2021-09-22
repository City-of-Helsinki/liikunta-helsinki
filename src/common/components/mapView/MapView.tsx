import React from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useTranslation } from "next-i18next";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";

import { MapItem } from "../../../types";
import Text from "../text/Text";
import venueIcon from "./VenueIcon";
import {
  BOUNDARIES,
  DEFAULT_POSITION,
  DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_URL,
} from "./mapConstants";
import styles from "./mapView.module.scss";

// Overwrite default keyboard value (true) in order to force all plugins to use
// marker variants without keyboard support.
L.Marker.prototype.options.keyboard = false;

const HiddenDivIcon = L.DivIcon.extend({
  _setIconStyles(img: HTMLImageElement, name: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    L.DivIcon.prototype._setIconStyles.call(this, img, name);

    img.setAttribute("aria-hidden", "true");
    // The Marker react-leaflet-markercluster uses must be configured with
    // `keyboard: false` for tabindex to be controllable here. Otherwise the
    // icons of this class will have their tabindex attribute overwritten by the
    // add icon routine in the Market class.
    img.setAttribute("tabindex", "-1");
  },
});

function createCustomClusterIcon(cluster) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new HiddenDivIcon({
    html: `<div tabindex="-1"><span tabindex="-1">${cluster.getChildCount()}</span></div>`,
    className: [
      "leaflet-marker-icon",
      "marker-cluster marker-cluster-small",
      "leaflet-zoom-animated",
      "leaflet-interactive",
      styles.clusterIcon,
    ].join(" "),
    iconSize: L.point(40, 40, true),
  });
}

type Props = {
  items: MapItem[];
};

function MapView({ items = [] }: Props) {
  const { t } = useTranslation("map_view");

  return (
    <div
      aria-hidden={false}
      tabIndex={-1}
      aria-label={t("map_accessibility_statement")}
      className={styles.mapView}
    >
      <MapContainer
        center={DEFAULT_POSITION}
        zoom={DEFAULT_ZOOM}
        maxBounds={BOUNDARIES}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        attributionControl={false}
      >
        <TileLayer
          attribution={`&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> ${t(
            "open_street_map_contributors"
          )}`}
          url={TILE_URL}
        />
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          iconCreateFunction={createCustomClusterIcon}
        >
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
                  <Link href={item.href}>{t("go_to_venue")}</Link>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default MapView;
