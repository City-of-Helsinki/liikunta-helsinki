/* eslint-disable max-len */

const isOpenNowMock = {
  is_open: true,
  resource_timezone: "Europe/Helsinki",
  resource_time_now: "2021-12-14T15:11:10.314095+02:00",
  matching_opening_hours: [
    {
      name: "",
      description: "",
      start_time: "09:00:00",
      end_time: "16:00:00",
      end_time_on_next_day: false,
      resource_state: "open",
      full_day: false,
      periods: [1620],
    },
  ],
  resource: {
    id: 123,
    name: {
      fi: "Leikkipuisto Linja",
      sv: "Lekparken Linja",
      en: "Playground Linja",
    },
    description: {
      fi: "- leikkivälineitä kaikenikäisille lapsille\n- kahluuallas kesällä\n- vesileikkimahdollisuus kesällä\n- aidattu piha pienille\n- pelikenttä\n- luistelukenttä talvella\n- hämähäkkiverkko",
      sv: "I en del av lekparkerna finns spelplaner som på vintern fryses till skridskobanor. I lekparkerna finns även bollväggar, utrustning för balansövningar, klätternät och plaskdammar som stöder motionsaktiviteter. Lekparkerna erbjuder möjligheter till motion och spel.",
      en: "Some play parks include playing fields, which are frozen in the winter to serve as ice skating rinks. Play parks also include ball game walls, balancing equipment, climbing nets and wading pools, which support sporting activities. Play parks offer opportunities for sports and games.",
    },
    address: {
      fi: "Toinen linja 6, Helsinki",
      sv: "Andra linjen 6, Helsingfors",
      en: "Toinen linja 6, Helsinki",
    },
    resource_type: "unit",
    children: [34228],
    parents: [],
    organization: "tprek:d4f4c64c-3a46-4ac8-93d2-fa6d4a0dcdb5",
    origins: [
      {
        data_source: {
          id: "tprek",
          name: {
            fi: "Toimipisterekisteri",
            sv: null,
            en: null,
          },
        },
        origin_id: "134",
      },
    ],
    last_modified_by: null,
    created: "2021-03-24T12:17:30.249602+02:00",
    modified: "2021-03-24T12:17:30.310105+02:00",
    extra_data: {
      admin_url:
        "https://asiointi.hel.fi/tprperhe/TPR/UI/ServicePoint/ServicePointEdit/601",
      citizen_url: "https://palvelukartta.hel.fi/fi/unit/134",
    },
    is_public: true,
    timezone: "Europe/Helsinki",
  },
};

export default isOpenNowMock;
