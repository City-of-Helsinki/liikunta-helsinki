import { ShowMode } from "../components/search/searchHeader/SearchHeader";

export default function getShowMode(show: string): ShowMode {
  return show === ShowMode.MAP || show === ShowMode.LIST ? show : ShowMode.LIST;
}
