/* eslint-disable max-len */

const mockUnit = {
  id: 123,
  org_id: "83e74666-0836-4c1d-948a-4b34a8b90301",
  dept_id: "c311e2ea-8705-4168-a3e0-3677fede1546",
  provider_type: "SELF_PRODUCED",
  data_source_url: "www.hel.fi",
  name_fi: "Päiväkoti Lappi",
  name_sv: "Päiväkoti Lappi",
  name_en: "Day care Lappi",
  ontologyword_ids: [160, 663, 831, 861],
  ontologytree_ids: [870, 871, 874, 879, 1090, 2125],
  latitude: 60.16692,
  longitude: 24.926613,
  northing_etrs_gk25: 6672672,
  easting_etrs_gk25: 25495926,
  northing_etrs_tm35fin: 6671807,
  easting_etrs_tm35fin: 384947,
  manual_coordinates: false,
  street_address_fi: "Lapinlahdenkatu 6 G",
  street_address_sv: "Lappviksgatan 6 G",
  street_address_en: "Lapinlahdenkatu 6 G",
  address_zip: "00180",
  address_city_fi: "Helsinki",
  address_city_sv: "Helsingfors",
  address_city_en: "Helsinki",
  phone: "+358 9 310 64132",
  call_charge_info_fi: "pvm/mpm",
  call_charge_info_sv: "lna/msa",
  call_charge_info_en: "local network charge/mobile call charge",
  email: "pk.lappi@hel.fi",
  www_fi: "https://www.hel.fi/varhaiskasvatus/fi/paivakodit/lappi",
  www_sv: "https://www.hel.fi/varhaiskasvatus/fi/paivakodit/lappi",
  www_en: "https://www.hel.fi/varhaiskasvatus/fi/paivakodit/lappi",
  address_postal_full_fi: "PL18912, 00099 Helsingin kaupunki",
  streetview_entrance_url:
    "https://maps.google.fi/?q=http:%2F%2Fwww.hel.fi%2Fpalvelukartta%2Fkml.aspx%3Flang%3Dfi%26id%3D123&ll=60.167011,24.926734&spn=0.000011,0.013036&layer=c&cbll=60.16704,24.92649&cbp=12,185.38,,0,-3.56&t=h&z=17&panoid=6LAXzKxDkEx9aIgWjA9Tgg",
  extra_searchwords_fi:
    "Esiopetus 2021-2022, eskari, lastentarha, tarha, varhaiskasvatus",
  extra_searchwords_en:
    "daycare, day care, preprimaryeducation, pre-primary education, preschool",
  accessibility_phone: "+358 9 310 64131",
  accessibility_email: "tiina.ivakko@hel.fi",
  accessibility_viewpoints:
    "00:unknown,11:red,12:red,13:red,21:red,22:red,23:red,31:red,32:red,33:red,41:red,51:red,52:red,61:unknown",
  created_time: "2007-11-15T00:00:00",
  modified_time: "2021-11-04T14:06:34",
  connections: [
    {
      section_type: "PHONE_OR_EMAIL",
      name_fi: "Päiväkodinjohtaja",
      name_en: "Manager of daycare centre",
      name_sv: "Daghemsföreståndare",
      contact_person: "Ivakko Tiina",
      phone: "+358 9 310 64132",
    },
    {
      section_type: "ESERVICE_LINK",
      name_fi:
        "Hakemus kerhotoimintaan, esiopetukseen ja esiopetusta täydentävään varhaiskasvatukseen",
      name_en:
        "Application for club activities, pre-primary education and municipal daycare that supplements pre-primary education",
      name_sv:
        "Ansökan till klubbverksamhet, förskoleundervisning och småbarnspedagogik som kompletterar förskoleundervisningen",
      www_fi:
        "https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/hallinto/palvelut/asiointipalvelu?id=4870",
      www_en:
        "https://www.hel.fi/helsinki/en/administration/administration/services/eservices?id=4870",
      www_sv:
        "https://www.hel.fi/helsinki/sv/stad-och-forvaltning/forvaltning/tjanster/e-tjanster?id=4870",
    },
    {
      section_type: "ESERVICE_LINK",
      name_fi: "Kerhohakemus sähköisessä asioinnissa",
      www_fi:
        "https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/hallinto/palvelut/asiointipalvelu?id=4947",
    },
    {
      section_type: "ESERVICE_LINK",
      name_fi: "Varhaiskasvatushakemus Asti-asiointipalvelussa",
      name_sv: "Ansökan om småbarnspedagogik",
      www_fi:
        "https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/hallinto/palvelut/asiointipalvelu?id=4512",
      www_sv:
        "https://www.hel.fi/helsinki/sv/stad-och-forvaltning/forvaltning/tjanster/e-tjanster?id=4512",
    },
  ],
  ontologyword_details: [
    { id: 160, schoolyear: "2021-2022" },
    { id: 160, schoolyear: "2022-2023" },
    { id: 663 },
    { id: 831 },
    { id: 861, schoolyear: "2021-2022" },
    { id: 861, schoolyear: "2022-2023" },
  ],
  service_descriptions: [
    { id: 2484, available_languages: ["en", "fi", "sv"] },
    { id: 2581, available_languages: ["en", "fi", "sv"] },
    { id: 2582, available_languages: ["en", "fi", "sv"] },
    { id: 2768, available_languages: ["en", "fi", "sv"] },
    { id: 3958, available_languages: ["fi"] },
    { id: 4094, available_languages: ["en", "fi", "sv"] },
    { id: 4701, available_languages: ["en", "fi", "sv"] },
    { id: 6241, available_languages: ["en", "fi", "sv"] },
    { id: 8693, available_languages: ["fi"] },
  ],
  accessibility_sentences: [
    {
      sentence_group_name: "Kulkureitti pääsisäänkäynnille",
      sentence_group_fi: "Reitti pääsisäänkäynnille",
      sentence_group_sv: "Rutten till huvudingången",
      sentence_group_en: "The route to the main entrance",
      sentence_fi:
        "Kulkureitti sisäänkäynnille on opastettu, epätasainen ja kapea sekä valaistu.",
      sentence_sv:
        "Rutten till ingången är skyltad, ojämn och smal samt belyst.",
      sentence_en:
        "The route to the entrance is guided, rough and narrow and illuminated.",
    },
    {
      sentence_group_name: "Kulkureitti pääsisäänkäynnille",
      sentence_group_fi: "Reitti pääsisäänkäynnille",
      sentence_group_sv: "Rutten till huvudingången",
      sentence_group_en: "The route to the main entrance",
      sentence_fi: "Kulkureitillä on 1 porrasaskelma.",
      sentence_sv: "På rutten finns 1 trappsteg.",
      sentence_en: "The passage has 1 step.",
    },
    {
      sentence_group_name: "Pääsisäänkäynti",
      sentence_group_fi: "Pääsisäänkäynti",
      sentence_group_sv: "Huvudingången",
      sentence_group_en: "The main entrance",
      sentence_fi: "Sisäänkäynti on vaikeasti hahmotettava mutta valaistu.",
      sentence_sv: "Ingången är svår att överblicka men belyst.",
      sentence_en: "The entrance is hard to perceive but illuminated",
    },
    {
      sentence_group_name: "Pääsisäänkäynti",
      sentence_group_fi: "Pääsisäänkäynti",
      sentence_group_sv: "Huvudingången",
      sentence_group_en: "The main entrance",
      sentence_fi: "Sisäänkäynnin yhteydessä on 1 porrasaskelma.",
      sentence_sv: "Vid ingången finns 1 trappsteg.",
      sentence_en: "In connection with the entrance, there is 1 step.",
    },
    {
      sentence_group_name: "Pääsisäänkäynti",
      sentence_group_fi: "Pääsisäänkäynti",
      sentence_group_sv: "Huvudingången",
      sentence_group_en: "The main entrance",
      sentence_fi:
        "Sisäänkäynnin ovet erottuvat selkeästi. Oven ulkopuolella on riittävästi vapaata tilaa liikkumiselle esim. pyörätuolin kanssa. Ovi vaatii summerin painamista, jonka jälkeen ovi aukeaa mutta on raskas.",
      sentence_sv:
        "Dörrarna vid ingången är lätta att urskilja. Utanför dörren finns tillräckligt med fritt utrymme för att röra sig t.ex. med rullstol. För att öppna dörren ska du trycka på en dörrsummer varefter dörren kan öppnas men är tung.",
      sentence_en:
        "The doors connected to the entrance stand out clearly. Outside the door there is sufficient room for moving e.g. with a wheelchair. The door requires the use of a buzzer and is heavy.",
    },
    {
      sentence_group_name: "Pääsisäänkäynti",
      sentence_group_fi: "Pääsisäänkäynti",
      sentence_group_sv: "Huvudingången",
      sentence_group_en: "The main entrance",
      sentence_fi: "Sisäänkäynnin yhteydessä on yli 2 cm korkeita kynnyksiä.",
      sentence_sv: "Vid ingången finns trösklar som är över 2 cm höga.",
      sentence_en: "The entrance has thresholds over 2 cm high.",
    },
    {
      sentence_group_name: "Pääsisäänkäynti",
      sentence_group_fi: "Pääsisäänkäynti",
      sentence_group_sv: "Huvudingången",
      sentence_group_en: "The main entrance",
      sentence_fi: "Tuulikaappi on ahdas.",
      sentence_sv: "Vindfånget är trångt.",
      sentence_en: "The foyer is cramped.",
    },
    {
      sentence_group_name: "Sisätilat",
      sentence_group_fi: "Sisätilat",
      sentence_group_sv: "I lokalen",
      sentence_group_en: "In the facility",
      sentence_fi: "Toimipisteessä on 2 kerrosta.",
      sentence_sv: "Verksamhetsstället har 2 våningsplan.",
      sentence_en: "The customer service point has 2 floors.",
    },
    {
      sentence_group_name: "Sisätilat",
      sentence_group_fi: "Sisätilat",
      sentence_group_sv: "I lokalen",
      sentence_group_en: "In the facility",
      sentence_fi:
        "Tilan keskeisillä kulkureiteillä on vähintään 4 kääntyvää porrasaskelmaa, jossa on käsijohteet molemmilla puolilla.",
      sentence_sv:
        "De inomhus gångvägarna har minst 4 trappsteg som svänger med räcken på båda sidorna.",
      sentence_en:
        "The indoor walkways have at least 4 turning steps with handrails on both sides.",
    },
    {
      sentence_group_name: "Sisätilat",
      sentence_group_fi: "Sisätilat",
      sentence_group_sv: "I lokalen",
      sentence_group_en: "In the facility",
      sentence_fi: "Sisätilojen ovet erottuvat selkeästi.",
      sentence_sv: "Dörrarna i lokalen är lätta att urskilja.",
      sentence_en: "The doors in the facility stand out clearly.",
    },
    {
      sentence_group_name: "Sisätilat",
      sentence_group_fi: "Sisätilat",
      sentence_group_sv: "I lokalen",
      sentence_group_en: "In the facility",
      sentence_fi:
        "Toimipisteessä on esteettömäksi merkitty wc kerroksessa 1. Wc:ssä ei ole tarpeeksi tilaa pyörätuolille.",
      sentence_sv:
        "I verksamhetsstället finns en toalett som har angetts som tillgänglig på plan 1. Det finns inte tillräckligt med utrymme för en rullstol på toaletten.",
      sentence_en:
        "The facility has a toilet marked as accessible on floor 1. The toilet does not have sufficient room for a wheelchair.",
    },
    {
      sentence_group_name: "Sisätilat",
      sentence_group_fi: "Sisätilat",
      sentence_group_sv: "I lokalen",
      sentence_group_en: "In the facility",
      sentence_fi: "Toinen esteettömäksi merkitty wc on kerroksessa 0.",
      sentence_sv:
        "En annan toalett som har angetts som tillgänglig finns på plan 0.",
      sentence_en:
        "A second toilet marked as accessible is located on floor 0.",
    },
  ],
};

export default mockUnit;
