import { MapContainer, TileLayer, Marker } from "@monsonjeremy/react-leaflet";
import "leaflet/dist/leaflet.css";

import styles from "./mapView.module.scss";

function MapView() {
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
    </MapContainer>
  );
}

export default MapView;
