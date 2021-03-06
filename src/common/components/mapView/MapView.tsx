import React, { useMemo, useRef, useEffect, useState } from "react";
import Link from "next/link";
import L, { LatLngExpression } from "leaflet";
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
  FOCUSED_ITEM_DEFAULT_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  TILE_URL,
} from "./mapConstants";
import { A11yHiddenDivIcon } from "./A11yHiddenIcon";
import styles from "./mapView.module.scss";

// Overwrite default keyboard value (true) in order to force all plugins to use
// marker variants without keyboard support.
L.Marker.prototype.options.keyboard = false;

function createCustomClusterIcon(cluster) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new A11yHiddenDivIcon({
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
  center?: LatLngExpression;
  zoom?: number;
  focusedItemId?: string;
};

function MapView({ items = [], center, zoom, focusedItemId }: Props) {
  const { t } = useTranslation("map_view");
  const focusedItem = useMemo(
    () => items.find((item) => item.id === focusedItemId),
    [items, focusedItemId]
  );
  // Store marker reference in state so that the component re-renders when it
  // the marker reference changes.
  const [focusedMarker, setFocusedMarker] = useState(null);
  const markerClusterGroupRef = useRef(null);

  const getFocusedItemPosition = (): LatLngExpression | null => {
    if (focusedItem?.location) {
      const [lng, lat] = focusedItem.location;
      return [lat, lng];
    }
    return null;
  };

  const getZoom = () => {
    if (zoom) return zoom;
    if (getFocusedItemPosition()) {
      return FOCUSED_ITEM_DEFAULT_ZOOM;
    }
    return DEFAULT_ZOOM;
  };

  useEffect(() => {
    const markerClusterGroup = markerClusterGroupRef.current;

    if (focusedItemId && markerClusterGroup && focusedMarker) {
      // Use zoomToShowLayer in order to unravel markers that may be clustered.
      markerClusterGroup?.zoomToShowLayer(focusedMarker, () => {
        focusedMarker?.openPopup();
      });
    }
  }, [focusedItemId, focusedMarker]);

  return (
    <div
      aria-hidden={false}
      tabIndex={-1}
      aria-label={t("map_accessibility_statement")}
      className={styles.mapView}
    >
      <MapContainer
        center={getFocusedItemPosition() ?? center ?? DEFAULT_POSITION}
        zoom={getZoom()}
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
          maxClusterRadius={60}
          animate={false}
          key={items.join() ?? "default"}
          ref={markerClusterGroupRef}
        >
          {items.map((item) => {
            if (!item.location) {
              return null;
            }

            const handleSetFocusedRef = (marker) => {
              const isFocusedItem = focusedItemId && item.id === focusedItemId;

              if (isFocusedItem) {
                setFocusedMarker(marker);
              }
            };

            return (
              <Marker
                key={item.id}
                position={[item.location[1], item.location[0]]}
                icon={venueIcon}
                ref={handleSetFocusedRef}
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
