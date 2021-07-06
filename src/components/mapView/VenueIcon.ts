import L from "leaflet";

const venueIcon = new L.Icon({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  iconUrl: "/images/venue-icon.svg",
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  iconRetinaUrl: "/images/venue-icon.svg",
  iconAnchor: null,
  popupAnchor: [0, -20],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [32, 32],
});

export default venueIcon;
