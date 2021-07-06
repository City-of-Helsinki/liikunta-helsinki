import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "@monsonjeremy/react-leaflet";
import "leaflet/dist/leaflet.css";

import venueIcon from "./VenueIcon";
import styles from "./mapView.module.scss";
import { Item } from "../../types";

type Props = {
  items: Item[];
};

function MapView({ items = [] }: Props) {
  return (
    <MapContainer
      center={[60.16687, 24.943781]}
      zoom={13}
      className={styles.mapView}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url="http://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}.png"
      />
      {items?.map((item) => (
        <Marker
          key={item.id}
          position={[item.location[1], item.location[0]]}
          icon={venueIcon}
        >
          <Popup>{item.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
