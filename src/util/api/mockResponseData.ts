export const mockLinkedDefaultData = {
  id: "tprek:61903",
  data_source: "tprek",
  publisher: "ahjo:u021600",
  divisions: [
    {
      type: "muni",
      ocd_id: "ocd-division/country:fi/kunta:vantaa",
      municipality: null,
      name: {
        fi: "Vantaa",
        sv: "Vanda",
      },
    },
  ],
  created_time: "2020-02-08T06:09:23.759193Z",
  last_modified_time: "2020-02-08T06:09:23.759206Z",
  custom_data: null,
  email: null,
  address_region: null,
  postal_code: "01260",
  post_office_box_num: null,
  address_country: null,
  deleted: false,
  has_upcoming_events: false,
  n_events: 0,
  image: null,
  parent: null,
  replaced_by: null,
  position: {
    type: "Point",
    coordinates: [25.118282, 60.309315],
  },
  address_locality: {
    fi: "Vantaa",
    sv: "Vanda",
    en: "Vantaa",
  },
  description: null,
  name: {
    fi: "Kuninkaanmäki - Kuusijärvi retkeilyreitti 1km",
  },
  info_url: null,
  street_address: {
    fi: "Kuusijärventie 3",
    sv: "Hanaböleträskvägen 3",
    en: "Kuusijärventie 3",
  },
  telephone: null,
  "@id": "https://api.hel.fi/linkedevents/v1/place/tprek:61903/",
  "@context": "http://schema.org",
  "@type": "Place",
};

export const mockTprekDefaultData = {
  id: 61903,
  org_id: "6d78f89c-9fd7-41d9-84e0-4b78c0fa25ce",
  dept_id: "b4e07809-a34e-4476-b210-2c29c1fd52cb",
  provider_type: "SELF_PRODUCED",
  data_source_url: "www.vantaa.fi",
  name_fi: "Kuninkaanmäki - Kuusijärvi retkeilyreitti 1km",
  ontologyword_ids: [582],
  ontologytree_ids: [590],
  sources: [
    {
      source: "tprek",
      id: "602307",
    },
  ],
  latitude: 60.309315,
  longitude: 25.118282,
  northing_etrs_gk25: 6688541,
  easting_etrs_gk25: 25506538,
  northing_etrs_tm35fin: 6687343,
  easting_etrs_tm35fin: 396033,
  manual_coordinates: true,
  street_address_fi: "Kuusijärventie 3",
  street_address_sv: "Hanaböleträskvägen 3",
  street_address_en: "Kuusijärventie 3",
  address_zip: "01260",
  address_city_fi: "Vantaa",
  address_city_sv: "Vanda",
  address_city_en: "Vantaa",
  accessibility_viewpoints:
    "00:unknown,11:unknown,12:unknown,13:unknown,21:unknown,22:unknown,23:unknown,31:unknown,32:unknown,33:unknown,41:unknown,51:unknown,52:unknown,61:unknown",
  created_time: "2020-02-08T05:21:23",
  modified_time: "2020-02-08T05:21:23",
  connections: [],
  ontologyword_details: [
    {
      id: 582,
    },
  ],
  service_descriptions: [
    {
      id: 7643,
      available_languages: ["fi"],
    },
  ],
  accessibility_sentences: [],
};

export const mockedResponse = {
  id: "tprek:61903",
  dataSource: "tprek",
  email: null,
  postalCode: "01260",
  image: null,
  position: {
    type: "Point",
    coordinates: [25.118282, 60.309315],
  },
  description: null,
  name: {
    fi: "Kuninkaanmäki - Kuusijärvi retkeilyreitti 1km",
  },
  streetAddress: {
    fi: "Kuusijärventie 3",
    en: "Kuusijärventie 3",
    sv: "Hanaböleträskvägen 3",
  },
  addressLocality: {
    fi: "Vantaa",
    en: "Vantaa",
    sv: "Vanda",
  },
  infoUrl: null,
  telephone: null,
};
