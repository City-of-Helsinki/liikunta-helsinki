import L from "leaflet";

function getA11yHiddenIcon(iconBaseClass) {
  return iconBaseClass.extend({
    _setIconStyles(img: HTMLImageElement, name: string) {
      iconBaseClass.prototype._setIconStyles.call(this, img, name);

      img.setAttribute("aria-hidden", "true");
      // The Marker this icon is used in must be configured with
      // `keyboard: false` for tabindex to be controllable here. Otherwise the
      // icons of this class will have their tabindex attribute overwritten by
      // the add icon routine in the Market class.
      img.setAttribute("tabindex", "-1");
    },
  });
}

export const A11yHiddenIcon = getA11yHiddenIcon(L.Icon);

export const A11yHiddenDivIcon = getA11yHiddenIcon(L.DivIcon);
