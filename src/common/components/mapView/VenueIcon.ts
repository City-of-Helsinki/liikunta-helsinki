import L from "leaflet";

const MapAriaHiddenIcon = L.Icon.extend({
  _setIconStyles(img: HTMLImageElement, name: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    L.Icon.prototype._setIconStyles.call(this, img, name);

    img.setAttribute("aria-hidden", "true");
  },
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const venueIcon = new MapAriaHiddenIcon({
  iconUrl: "/images/venue-icon.svg",
  iconRetinaUrl: "/images/venue-icon.svg",
  iconAnchor: null,
  popupAnchor: [0, -20],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [32, 32],
});

export default venueIcon;
