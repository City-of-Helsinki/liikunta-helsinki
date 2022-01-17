import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import card from "../../public/locales/fi/card.json";
import collection_count_label from "../../public/locales/fi/collection_count_label.json";
import collection_page from "../../public/locales/fi/collection_page.json";
import common from "../../public/locales/fi/common.json";
import date_time_picker from "../../public/locales/fi/date_time_picker.json";
import footer from "../../public/locales/fi/footer.json";
import geolocation_provider from "../../public/locales/fi/geolocation_provider.json";
import hardcoded_shortcuts from "../../public/locales/fi/hardcoded_shortcuts.json";
import home_page from "../../public/locales/fi/home_page.json";
import info_block from "../../public/locales/fi/info_block.json";
import landing_page_search_form from "../../public/locales/fi/landing_page_search_form.json";
import map_box from "../../public/locales/fi/map_box.json";
import map_view from "../../public/locales/fi/map_view.json";
import multi_select_combobox from "../../public/locales/fi/multi_select_combobox.json";
import navigation from "../../public/locales/fi/navigation.json";
import search_header from "../../public/locales/fi/search_header.json";
import search_list from "../../public/locales/fi/search_list.json";
import search_page_search_form from "../../public/locales/fi/search_page_search_form.json";
import search_page from "../../public/locales/fi/search_page.json";
import share_links from "../../public/locales/fi/share_links.json";
import toast from "../../public/locales/fi/toast.json";
import upcoming_events_section from "../../public/locales/fi/upcoming_events_section.json";
import venue_page from "../../public/locales/fi/venue_page.json";

const translation = {
  card,
  collection_count_label,
  collection_page,
  common,
  date_time_picker,
  footer,
  geolocation_provider,
  hardcoded_shortcuts,
  home_page,
  info_block,
  landing_page_search_form,
  map_box,
  map_view,
  multi_select_combobox,
  navigation,
  search_header,
  search_list,
  search_page_search_form,
  search_page,
  share_links,
  toast,
  upcoming_events_section,
  venue_page,
};

i18n.use(initReactI18next).init({
  lng: "fi",
  fallbackLng: "fi",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: {
    useSuspense: false,
  },
  resources: {
    fi: translation,
  },
});

export default i18n;
