const ontologytreeMock = [
  {
    id: 870,
    parent_id: 869,
    name_fi: "Suomenkielinen päivähoito",
    name_sv: "Finskspråkig dagvård",
    name_en: "Day care in Finnish",
    child_ids: [871, 872, 874, 875, 876, 877, 878, 879, 880, 2013],
    ontologyword_reference: "663",
    extra_searchwords_fi: "varhaiskasvatus",
    extra_searchwords_sv: "småbarnspedagogik",
    extra_searchwords_en: "early education and care",
  },
  {
    id: 871,
    parent_id: 870,
    name_fi: "päivähoito",
    name_sv: "dagvård",
    name_en: "day care",
    child_ids: [],
    ontologyword_reference: "663",
    extra_searchwords_fi: "varhaiskasvatus",
    extra_searchwords_sv: "småbarnspedagogik",
    extra_searchwords_en: "early education and care",
  },
  {
    id: 874,
    parent_id: 870,
    name_fi: "ympärivuorokautinen hoito",
    name_sv: "dygnet runt-vård",
    name_en: "round-the-clock care",
    child_ids: [],
    ontologyword_reference: "663*831",
  },
  {
    id: 879,
    parent_id: 870,
    name_fi: "esiopetus",
    name_sv: "förskoleundervisning",
    name_en: "pre-primary education",
    child_ids: [],
    ontologyword_reference: "663*160+861*160",
  },
  {
    id: 1090,
    parent_id: 1089,
    name_fi: "Päivähoidon järjestämä esiopetus",
    name_sv: "Förskoleundervisning som ordnas av dagvården",
    name_en: "Pre-primary education organised by day care",
    child_ids: [],
    ontologyword_reference:
      "58*160+151*160+164*160+188*160+569*160+607*160+614*160+663*160+773*160+795*160+861*160",
  },
  {
    id: 2125,
    parent_id: 2122,
    name_fi: "Päivähoidon järjestämä esiopetus",
    name_sv: "Förskoleundervisning som ordnas av dagvården",
    name_en: "Pre-primary education organised by day care",
    child_ids: [],
    ontologyword_reference:
      "58*160+151*160+164*160+188*160+569*160+607*160+614*160+663*160+773*160+795*160+861*160",
  },
];

export default ontologytreeMock;
