/* eslint-disable max-len */

import { getOpeningHoursForWeek } from "../../../tests/getOpeningHours";

export const defaultConnections = [
  {
    __typename: "Connection",
    sectionType: "OPENING_HOURS",
    name: "Poikkeusaukioloajat\n28.12.2021-24.1.2022 suljettu",
  },
  {
    __typename: "Connection",
    sectionType: "OPENING_HOURS",
    name: "HUOM! \nEdellytämme koronapassia ja henkilöllisyystodistusta kaikilta yli 16-vuotiailta.",
  },
  {
    __typename: "Connection",
    sectionType: "OPENING_HOURS",
    name: "Sisäänpääsyajat 30.8.2021 alkaen\n\nNaiset (uintiaika 2 h)\nmaanantaisin \n1. krs 12.00 - 20.00\n2. krs suljettu \nkeskiviikkoisin \n1. krs 6.30 - 20.00\n2. krs 13.00 - 20.00 \nperjantaisin \n1. krs 6.30 - 20.00\n2. krs 13.00 - 20.00 \nsunnuntaisin \n1. krs 11.00 - 20.00\n2. krs 13.00 - 20.00 \nerityisuimakortilla \n1. krs 9.00 - 10.00",
  },
  {
    __typename: "Connection",
    sectionType: "OPENING_HOURS",
    name: "Miehet (uintiaika 2 h) \ntiistaisin \n1. krs 6.30 - 20.00 \n2. krs 13.00 - 20.00 \ntorstaisin \n1. krs 6.30 - 20.00 \n2. krs 13.00 - 20.00 \nlauantaisin \n1. krs 7.00 - 20.00 \n2. krs 13.00 - 20.00 \nsunnuntaisin\nerityisuimakortilla \n1. krs 7.00 - 8.00",
  },
  {
    __typename: "Connection",
    sectionType: "OPENING_HOURS",
    name: "Uintiaika päättyy 30 min kassan sulkemisajan jälkeen. Hallista tulee poistua viimeistään kello 21.00.\n\nHuom! Keskiviikko- ja torstaiaamuisin saunatiloissa siivotaan uimahallin aukioloaikana. Yrjönkadun uimahallissa allas ja uimaradat ovat aukioloaikoina vapaassa käytössä, eikä niitä voi varata erikseen omaan käyttöön.",
  },
  {
    __typename: "Connection",
    sectionType: "HIGHLIGHT",
    name: "Uimahallit ja sisäliikuntatilat ovat kiinni 28.12.2021 - 10.1.2022.",
  },
  {
    __typename: "Connection",
    sectionType: "PHONE_OR_EMAIL",
    name: "Kassa",
  },
  {
    __typename: "Connection",
    sectionType: "PHONE_OR_EMAIL",
    name: "Liikunnanohjaus",
  },
  {
    __typename: "Connection",
    sectionType: "PHONE_OR_EMAIL",
    name: "Tiimiesihenkilö",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Hintaryhmien määrittelyt",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Asiakaskortin sopimusehdot",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Uimapukuohjeistus",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Erityisuimakortti",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Järjestyssäännöt",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Nettilippu 2. kerrokseen",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Tilaussaunat",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Cafe Yrjö",
  },
  {
    __typename: "Connection",
    sectionType: "LINK",
    name: "Vesijumpat ke 7.45 - 8.15 ja pe 7.30 - 8.00",
  },
  {
    __typename: "Connection",
    sectionType: "PRICE",
    name: "Aikuiset \n- kertamaksu 5,50 e \n- 10 kerran sarjakortti tai kk-kortti (30 pv) 44 e\n- kausikortti (120 pv) 132 e\n\nLapset (7-17 v.) ja Muut \n- kertamaksu 3 e\n- 10 kerran sarjakortti tai kk-kortti (30 pv) 24 e\n- kausikortti (120 pv) 72 e\n\n- henkilökohtainen asiakaskortti (kausi-, kuukausi- ja sarjaliput) 4 e\n- pyyhe 7 e\n- uimapuku 7 e\n- kylpytakki 10 e\n- pefletti, saippua, shampoo 1 e/kpl\n- istumahyttilisä 1 e",
  },
  {
    __typename: "Connection",
    sectionType: "PRICE",
    name: "2. krs (uinti 1. kerroksen altaassa)\nAikuiset\n- kertamaksu 16 e\nLapset (7-17 v.) ja Muut \n- kertamaksu 11 e\n\nSisältää: lepohytti, pyyhe, kylpytakki (saatavuuden mukaan), pefletti, uinti, höyrysauna, puulämmitteinen sauna ja infrapunasauna.",
  },
];

export const getVenue = (overrides) => ({
  addressLocality: "Helsinki",
  dataSource: "",
  description: "",
  email: "",
  id: "tprek:123",
  image: "",
  infoUrl: "https://hel.fi",
  name: "Eiran uimaranta",
  position: {
    type: "Point",
    coordinates: [1, 2],
  },
  postalCode: "00001",
  streetAddress: "Eirantie 3",
  telephone: "+35812345678",
  openingHours: getOpeningHoursForWeek(),
  isOpen: false,
  ontologyTree: [],
  ontologyWords: [],
  accessibilitySentences: [
    {
      groupName: "Pääsisäänkäynti",
      sentences: ["Erottuu selkeästi", "Ahdas tuulikaappi"],
    },
  ],
  connections: defaultConnections,
  ...overrides,
});
