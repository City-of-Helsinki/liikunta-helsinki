import { LatLngBoundsLiteral, LatLngExpression } from "leaflet";

export const TILE_URL =
  "http://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}.png";

export const DEFAULT_POSITION: LatLngExpression = [60.2087778, 24.9980714];

export const DEFAULT_ZOOM = 12;

export const FOCUSED_ITEM_DEFAULT_ZOOM = 18;

export const MIN_ZOOM = 11;

export const MAX_ZOOM = 18;

export const BOUNDARIES: LatLngBoundsLiteral = [
  [59.4, 23.8],
  [61.5, 25.8],
];
